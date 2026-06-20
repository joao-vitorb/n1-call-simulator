import { useState } from 'react';
import { useTrainingSession } from '../../contexts/TrainingSessionContext';
import { useElapsedTime } from '../../hooks/useElapsedTime';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { pickRandomScenario } from '../../services/scenarioEngine';
import {
  customerProvider,
  type ConversationMessage,
} from '../../services/conversationProvider';
import { sacProvider, sacOpeningLine } from '../../services/sacProvider';
import { pickSacAttendant, SAC_NUMBER, type SacAttendant } from '../../utils/sac';
import { CallSidebar } from './CallSidebar';
import { CallStage } from './CallStage';
import { SacCallStage } from './SacCallStage';
import { CallTranscript, type CallStatus } from './CallTranscript';
import { CallCategorization } from './CallCategorization';
import { TransferModal } from './TransferModal';

function speedToRate(speed: string): number {
  const normalized = speed.toLowerCase();
  if (normalized.includes('lenta') || normalized.includes('pausa')) return 0.85;
  if (
    normalized.includes('rápida') ||
    normalized.includes('rapida') ||
    normalized.includes('aceler')
  ) {
    return 1.15;
  }
  return 1;
}

type SacCall = {
  attendant: SacAttendant;
  startedAt: string;
  messages: ConversationMessage[];
};

export function TrainingCall() {
  const {
    onlineSince,
    activeCall,
    finishedCalls,
    viewingCallId,
    receiveCall,
    hangUp,
    selectCall,
    updateCallForm,
    saveCall,
    appendMessage,
  } = useTrainingSession();
  const onlineSeconds = useElapsedTime(onlineSince);
  const { speak, cancel: cancelSpeech } = useSpeechSynthesis();

  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ttsActive, setTtsActive] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [asrError, setAsrError] = useState<string | null>(null);
  const [sacCall, setSacCall] = useState<SacCall | null>(null);
  const [reachedAttendant, setReachedAttendant] = useState<SacAttendant | null>(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [dialError, setDialError] = useState<string | null>(null);

  const viewingCall =
    [activeCall, ...finishedCalls].find((call) => call?.id === viewingCallId) ??
    activeCall ??
    null;

  const { supported: asrSupported } = useSpeechRecognition({
    active: sacCall
      ? !muted && !ttsActive && !aiBusy
      : !!activeCall && !muted && !paused && !ttsActive && !aiBusy,
    onResult: (transcript) => {
      if (sacCall) {
        handleAgentSpokeToSac(transcript);
      } else {
        handleAgentSpoke(transcript);
      }
    },
    onError: (error) => setAsrError(`Erro no microfone: ${error}`),
  });

  async function handleAgentSpoke(transcript: string) {
    if (!activeCall) return;
    const agentMessage: ConversationMessage = {
      role: 'agent',
      text: transcript,
      timestamp: new Date().toISOString(),
    };
    appendMessage(activeCall.id, agentMessage);
    setAsrError(null);
    setAiBusy(true);
    try {
      const reply = await customerProvider.reply(activeCall.scenario, [
        ...activeCall.messages,
        agentMessage,
      ]);
      const customerMessage: ConversationMessage = {
        role: 'customer',
        text: reply,
        timestamp: new Date().toISOString(),
      };
      appendMessage(activeCall.id, customerMessage);
      setTtsActive(true);
      speak(reply, {
        onStart: () => setTtsActive(true),
        onEnd: () => setTtsActive(false),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao consultar a IA.';
      setAsrError(message);
    } finally {
      setAiBusy(false);
    }
  }

  async function handleAgentSpokeToSac(transcript: string) {
    if (!sacCall) return;
    const attendant = sacCall.attendant;
    const agentMessage: ConversationMessage = {
      role: 'agent',
      text: transcript,
      timestamp: new Date().toISOString(),
    };
    const history = [...sacCall.messages, agentMessage];
    setSacCall((current) =>
      current ? { ...current, messages: [...current.messages, agentMessage] } : null,
    );
    setAsrError(null);
    setAiBusy(true);
    try {
      const reply = await sacProvider.reply(attendant, history);
      const sacMessage: ConversationMessage = {
        role: 'customer',
        text: reply,
        timestamp: new Date().toISOString(),
      };
      setSacCall((current) =>
        current ? { ...current, messages: [...current.messages, sacMessage] } : null,
      );
      setTtsActive(true);
      speak(reply, {
        onStart: () => setTtsActive(true),
        onEnd: () => setTtsActive(false),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao consultar a IA.';
      setAsrError(message);
    } finally {
      setAiBusy(false);
    }
  }

  function handleReceiveCall() {
    cancelSpeech();
    setMuted(false);
    setPaused(false);
    setSacCall(null);
    setReachedAttendant(null);
    setShowTransfer(false);
    setDialError(null);
    setAsrError(null);
    setAiBusy(false);
    const scenario = pickRandomScenario();
    receiveCall(scenario);
    setTtsActive(true);
    speak(scenario.openingLine, {
      rate: speedToRate(scenario.voiceProfile.speed),
      onStart: () => setTtsActive(true),
      onEnd: () => setTtsActive(false),
    });
  }

  function handleHangUp() {
    cancelSpeech();
    setTtsActive(false);
    setAiBusy(false);
    setMuted(false);
    setPaused(false);
    setSacCall(null);
    setReachedAttendant(null);
    setShowTransfer(false);
    setDialError(null);
    hangUp();
  }

  function handleToggleMute() {
    setMuted((value) => !value);
  }

  function handleTogglePause() {
    setPaused((value) => {
      const next = !value;
      if (next) {
        cancelSpeech();
        setTtsActive(false);
      }
      return next;
    });
  }

  function handleDial(value: string) {
    setDialError(null);
    if (!activeCall) {
      setDialError('Inicie uma ligação antes de discar.');
      return;
    }
    if (sacCall) return;
    if (value !== SAC_NUMBER) {
      setDialError(`Ramal ${value} não atende.`);
      return;
    }
    cancelSpeech();
    setPaused(true);
    const attendant = pickSacAttendant();
    const startedAt = new Date().toISOString();
    const opening = sacOpeningLine(attendant);
    setSacCall({
      attendant,
      startedAt,
      messages: [{ role: 'customer', text: opening, timestamp: startedAt }],
    });
    setReachedAttendant(attendant);
    setTtsActive(true);
    speak(opening, {
      onStart: () => setTtsActive(true),
      onEnd: () => setTtsActive(false),
    });
  }

  function handleHangUpSac() {
    cancelSpeech();
    setTtsActive(false);
    setAiBusy(false);
    setSacCall(null);
    setPaused(false);
  }

  function handleTransferConfirmed() {
    setShowTransfer(false);
    setReachedAttendant(null);
    handleHangUp();
  }

  const status: CallStatus = (() => {
    if (!viewingCall) return 'idle';
    if (!asrSupported) return 'unsupported';
    if (asrError) return 'error';
    if (activeCall?.id !== viewingCall.id) return 'idle';
    if (paused) return 'paused';
    if (muted) return 'muted';
    if (aiBusy) return 'thinking';
    if (ttsActive) return 'speaking';
    return 'listening';
  })();

  const sacStatus: CallStatus = (() => {
    if (!asrSupported) return 'unsupported';
    if (asrError) return 'error';
    if (muted) return 'muted';
    if (aiBusy) return 'thinking';
    if (ttsActive) return 'speaking';
    return 'listening';
  })();

  return (
    <section className="flex flex-1">
      <CallSidebar
        onlineSeconds={onlineSeconds}
        callsCount={finishedCalls.length}
        activeCall={activeCall}
        finishedCalls={finishedCalls}
        selectedId={viewingCallId}
        onSelectCall={selectCall}
        onDial={handleDial}
        dialDisabled={!activeCall || sacCall !== null}
        dialError={dialError}
      />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-zinc-50 p-6">
        {sacCall ? (
          <>
            <SacCallStage
              attendant={sacCall.attendant}
              startedAt={sacCall.startedAt}
              muted={muted}
              onToggleMute={handleToggleMute}
              onHangUp={handleHangUpSac}
            />
            <CallTranscript
              messages={sacCall.messages}
              contactName={sacCall.attendant.name}
              status={sacStatus}
              error={asrError}
            />
          </>
        ) : (
          <>
            <CallStage
              activeCall={activeCall}
              muted={muted}
              paused={paused}
              onReceive={handleReceiveCall}
              onHangUp={handleHangUp}
              onToggleMute={handleToggleMute}
              onTogglePause={handleTogglePause}
              onTransfer={() => setShowTransfer(true)}
            />
            {viewingCall ? (
              <>
                <CallTranscript
                  messages={viewingCall.messages}
                  contactName={viewingCall.scenario.contactName}
                  status={status}
                  error={asrError}
                />
                <CallCategorization
                  call={viewingCall}
                  onUpdate={(updates) => updateCallForm(viewingCall.id, updates)}
                  onSave={() => saveCall(viewingCall.id)}
                />
              </>
            ) : (
              <EmptyForm />
            )}
          </>
        )}
      </div>

      {showTransfer && (
        <TransferModal
          reachedAttendant={reachedAttendant}
          onClose={() => setShowTransfer(false)}
          onConfirmed={handleTransferConfirmed}
        />
      )}
    </section>
  );
}

function EmptyForm() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white p-12">
      <p className="max-w-sm text-center text-sm text-zinc-500">
        Receba uma ligação ou selecione um atendimento do histórico para visualizar o
        formulário.
      </p>
    </div>
  );
}
