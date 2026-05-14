import { useElapsedTime } from '../../hooks/useElapsedTime';
import { formatElapsed } from '../../utils/time';
import type { ActiveCall } from '../../types/trainingCall';

type CallStageProps = {
  activeCall: ActiveCall | null;
  onReceive: () => void;
  onHangUp: () => void;
};

export function CallStage({ activeCall, onReceive, onHangUp }: CallStageProps) {
  const callSeconds = useElapsedTime(activeCall?.startedAt ?? null);

  if (!activeCall) {
    return (
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 bg-zinc-50 px-6 py-4">
        <div>
          <p className="text-xs text-zinc-500">Número de telefone</p>
          <p className="text-lg font-medium text-zinc-400">—</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Tempo de ligação</p>
          <p className="text-lg font-medium text-zinc-400">00:00</p>
        </div>
        <button
          type="button"
          onClick={onReceive}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Receber ligação
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-200 bg-zinc-50 px-6 py-4">
      <div>
        <p className="text-xs text-zinc-500">Número de telefone</p>
        <p className="text-lg font-medium text-zinc-900">{activeCall.phoneNumber}</p>
      </div>
      <div>
        <p className="text-xs text-zinc-500">Tempo de ligação</p>
        <p className="text-lg font-medium text-emerald-600">{formatElapsed(callSeconds)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Mute
        </button>
        <button
          type="button"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Pause
        </button>
        <button
          type="button"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Transferência
        </button>
        <button
          type="button"
          onClick={onHangUp}
          className="rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
        >
          Desligar
        </button>
      </div>
    </div>
  );
}
