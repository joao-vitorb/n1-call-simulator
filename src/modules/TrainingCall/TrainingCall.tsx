import { useTrainingSession } from '../../contexts/TrainingSessionContext';
import { useElapsedTime } from '../../hooks/useElapsedTime';
import { CallSidebar } from './CallSidebar';
import { CallStage } from './CallStage';
import { CallCategorization } from './CallCategorization';

const PLACEHOLDER_PHONE = '(11) 99999-9999';

export function TrainingCall() {
  const { onlineSince, activeCall, finishedCalls, receiveCall, hangUp } = useTrainingSession();
  const onlineSeconds = useElapsedTime(onlineSince);

  return (
    <section className="flex flex-1">
      <CallSidebar
        onlineSeconds={onlineSeconds}
        callsCount={finishedCalls.length}
        finishedCalls={finishedCalls}
      />
      <div className="flex flex-1 flex-col">
        <CallStage
          activeCall={activeCall}
          onReceive={() => receiveCall(PLACEHOLDER_PHONE)}
          onHangUp={hangUp}
        />
        <CallCategorization />
      </div>
    </section>
  );
}
