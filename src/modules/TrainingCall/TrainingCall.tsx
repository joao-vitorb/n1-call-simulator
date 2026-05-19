import { useTrainingSession } from '../../contexts/TrainingSessionContext';
import { useElapsedTime } from '../../hooks/useElapsedTime';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { pickRandomScenario } from '../../services/scenarioEngine';
import { CallSidebar } from './CallSidebar';
import { CallStage } from './CallStage';
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
  } = useTrainingSession();
  const onlineSeconds = useElapsedTime(onlineSince);
  const { speak, cancel: cancelSpeech } = useSpeechSynthesis();

  const viewingCall =
    activeCall ?? finishedCalls.find((call) => call.id === viewingCallId) ?? null;

  function handleReceiveCall() {
    const scenario = pickRandomScenario();
    receiveCall(scenario);
    speak(scenario.openingLine, { rate: speedToRate(scenario.voiceProfile.speed) });
  }

  function handleHangUp() {
    cancelSpeech();
    hangUp();
  }

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
          onReceive={handleReceiveCall}
          onHangUp={handleHangUp}
        />
        {viewingCall ? (
          <CallCategorization
            call={viewingCall}
            onUpdate={(updates) => updateCallForm(viewingCall.id, updates)}
            onSave={() => saveCall(viewingCall.id)}
          />
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
