import { useElapsedTime } from '../../hooks/useElapsedTime';
import { formatElapsed } from '../../utils/time';
import type { CallEntry } from '../../types/trainingCall';

type CallStageProps = {
  activeCall: CallEntry | null;
  muted: boolean;
  paused: boolean;
  onReceive: () => void;
  onHangUp: () => void;
  onToggleMute: () => void;
  onTogglePause: () => void;
};

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A16 16 0 014.5 5.7 2 2 0 016.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CallStage({
  activeCall,
  muted,
  paused,
  onReceive,
  onHangUp,
  onToggleMute,
  onTogglePause,
}: CallStageProps) {
  const callSeconds = useElapsedTime(activeCall?.startedAt ?? null);

  if (!activeCall) {
    return (
      <div className="shrink-0 rounded-xl border border-zinc-200 bg-white p-6 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
              <PhoneIcon />
            </span>
            <div>
              <p className="text-sm font-medium text-zinc-900">Nenhuma ligação ativa</p>
              <p className="text-xs text-zinc-500">
                Clique em receber para iniciar um atendimento.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onReceive}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Receber ligação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shrink-0 rounded-xl border border-zinc-200 bg-white p-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/60">
            <PhoneIcon />
          </span>
          <div>
            <p className="font-mono text-lg font-medium text-zinc-900">{activeCall.phoneNumber}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
              <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Em ligação · <span className="font-mono text-emerald-600">{formatElapsed(callSeconds)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            aria-pressed={muted}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              muted
                ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            {muted ? 'Mutado' : 'Mute'}
          </button>
          <button
            type="button"
            onClick={onTogglePause}
            aria-pressed={paused}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              paused
                ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            {paused ? 'Em espera' : 'Pause'}
          </button>
          <button
            type="button"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Transferência
          </button>
          <button
            type="button"
            onClick={onHangUp}
            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-700"
          >
            Desligar
          </button>
        </div>
      </div>
    </div>
  );
}
