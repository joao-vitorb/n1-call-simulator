import { useElapsedTime } from '../../hooks/useElapsedTime';
import { formatElapsed } from '../../utils/time';
import { SAC_NUMBER, type SacAttendant } from '../../utils/sac';

type SacCallStageProps = {
  attendant: SacAttendant;
  startedAt: string;
  muted: boolean;
  onToggleMute: () => void;
  onHangUp: () => void;
};

export function SacCallStage({ attendant, startedAt, muted, onToggleMute, onHangUp }: SacCallStageProps) {
  const seconds = useElapsedTime(startedAt);

  return (
    <div className="shrink-0 rounded-xl border border-indigo-200 bg-indigo-50/40 p-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {attendant.name.charAt(0)}
          </span>
          <div>
            <p className="text-sm font-medium text-zinc-900">
              SAC · {attendant.name} <span className="font-mono text-zinc-500">(ramal {attendant.extension})</span>
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
              <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
              Ligação interna · ramal <span className="font-mono">{SAC_NUMBER}</span> ·{' '}
              <span className="font-mono text-indigo-600">{formatElapsed(seconds)}</span>
            </p>
            <p className="mt-1 text-xs text-amber-600">Cliente em espera.</p>
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
            onClick={onHangUp}
            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-700"
          >
            Desligar 3002
          </button>
        </div>
      </div>
    </div>
  );
}
