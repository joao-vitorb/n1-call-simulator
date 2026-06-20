import { useElapsedTime } from '../../hooks/useElapsedTime';
import { formatElapsed } from '../../utils/time';
import type { CallEntry } from '../../types/trainingCall';
import {
  ControlButton,
  HangupIcon,
  MicIcon,
  MicOffIcon,
  PauseIcon,
  TransferIcon,
} from './CallControlButton';

type CallStageProps = {
  call: CallEntry | null;
  isActive: boolean;
  muted: boolean;
  paused: boolean;
  onReceive: () => void;
  onHangUp: () => void;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onTransfer: () => void;
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
  call,
  isActive,
  muted,
  paused,
  onReceive,
  onHangUp,
  onToggleMute,
  onTogglePause,
  onTransfer,
}: CallStageProps) {
  const liveSeconds = useElapsedTime(isActive ? call?.startedAt ?? null : null);

  if (!call) {
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
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isActive ? 'bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/60' : 'bg-zinc-100 text-zinc-400'
            }`}
          >
            <PhoneIcon />
          </span>
          <div>
            <p className="font-mono text-lg font-medium text-zinc-900">{call.phoneNumber}</p>
            {isActive ? (
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
                <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Em ligação · <span className="font-mono text-emerald-600">{formatElapsed(liveSeconds)}</span>
              </p>
            ) : (
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                Ligação encerrada · <span className="font-mono">{formatElapsed(call.durationSeconds ?? 0)}</span>
              </p>
            )}
          </div>
        </div>

        {isActive && (
          <div className="flex items-center gap-2">
            <ControlButton
              icon={muted ? <MicOffIcon /> : <MicIcon />}
              label={muted ? 'Mutado' : 'Mute'}
              onClick={onToggleMute}
              tone={muted ? 'active-red' : 'default'}
              pressed={muted}
            />
            <ControlButton
              icon={<PauseIcon />}
              label={paused ? 'Em espera' : 'Pause'}
              onClick={onTogglePause}
              tone={paused ? 'active-amber' : 'default'}
              pressed={paused}
            />
            <ControlButton icon={<TransferIcon />} label="Transferir" onClick={onTransfer} />
            <ControlButton icon={<HangupIcon />} label="Desligar" onClick={onHangUp} tone="danger" />
          </div>
        )}
      </div>
    </div>
  );
}
