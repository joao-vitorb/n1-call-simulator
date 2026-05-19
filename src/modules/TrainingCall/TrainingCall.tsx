import { useState } from 'react';
import { useTrainingSession } from '../../contexts/TrainingSessionContext';
import { useElapsedTime } from '../../hooks/useElapsedTime';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { pickRandomScenario } from '../../services/scenarioEngine';
import {
  pollinationsProvider,
  type ConversationMessage,
} from '../../services/conversationProvider';
import { CallSidebar } from './CallSidebar';
import { CallStage } from './CallStage';
import { CallTranscript, type CallStatus } from './CallTranscript';
import { CallCategorization } from './CallCategorization';

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

export function TrainingCall() {
  const {
    onlineSince,
    activeCall,
    finishedCalls,
    viewingCallId,
    receiveCall,
    hangUp,
    selectFinishedCall,
    updateCallForm,
    saveCall,
    appendMessage,
  } = useTrainingSession();
  const onlineSeconds = useElapsedTime(onlineSince);
  const { speak, cancel: cancelSpeech } = useSpeechSynthesis();

  const [muted, setMuted] = useState(false);
  const [ttsActive, setTtsActive] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [asrError, setAsrError] = useState<string | null>(null);

  const viewingCall =
    activeCall ?? finishedCalls.find((call) => call.id === viewingCallId) ?? null;

  const { supported: asrSupported } = useSpeechRecognition({
    active: !!activeCall && !muted && !ttsActive && !aiBusy,
    onResult: (transcript) => handleAgentSpoke(transcript),
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
      const reply = await pollinationsProvider.reply(activeCall.scenario, [
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

  function handleReceiveCall() {
    cancelSpeech();
    setMuted(false);
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
    hangUp();
  }

  function handleToggleMute() {
    setMuted((value) => !value);
  }

  const status: CallStatus = (() => {
    if (!viewingCall) return 'idle';
    if (!asrSupported) return 'unsupported';
    if (asrError) return 'error';
    if (activeCall?.id !== viewingCall.id) return 'idle';
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
        finishedCalls={finishedCalls}
        selectedId={viewingCallId}
        disabled={activeCall !== null}
        onSelectCall={selectFinishedCall}
      />
      <div className="flex flex-1 flex-col">
        <CallStage
          activeCall={activeCall}
          muted={muted}
          onReceive={handleReceiveCall}
          onHangUp={handleHangUp}
          onToggleMute={handleToggleMute}
        />
        {viewingCall ? (
          <>
            <CallTranscript call={viewingCall} status={status} error={asrError} />
            <CallCategorization
              call={viewingCall}
              onUpdate={(updates) => updateCallForm(viewingCall.id, updates)}
              onSave={() => saveCall(viewingCall.id)}
            />
          </>
        ) : (
          <EmptyForm />
        )}
      </div>
    </section>
  );
}

function EmptyForm() {
  return (
    <div className="flex flex-1 items-center justify-center bg-white p-8">
      <p className="max-w-sm text-center text-sm text-zinc-500">
        Receba uma ligação ou selecione um atendimento do histórico para visualizar o
        formulário.
      </p>
    </div>
  );
}
