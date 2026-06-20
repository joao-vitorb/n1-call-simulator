import type { ReactNode } from 'react';

type Tone = 'default' | 'active-red' | 'active-amber' | 'danger';

type ControlButtonProps = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  tone?: Tone;
  pressed?: boolean;
};

const TONE_CLASS: Record<Tone, string> = {
  default: 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50',
  'active-red': 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100',
  'active-amber': 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100',
  danger: 'border-red-600 bg-red-600 text-white hover:bg-red-700',
};

export function ControlButton({ icon, label, onClick, tone = 'default', pressed }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-lg border text-[10px] font-medium transition-colors ${TONE_CLASS[tone]}`}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </button>
  );
}

export function MicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function MicOffIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M9 9v-3a3 3 0 016 0v5M15 13a3 3 0 01-5 2.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5 11a7 7 0 0010.5 6M12 18v3M4 4l16 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M9 5v14M15 5v14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function TransferIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A16 16 0 014.5 5.7 2 2 0 016.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M15 3h6m0 0v6m0-6l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HangupIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3.5 14.5l2.3-.4a1.5 1.5 0 001.2-1.1l.4-1.6a8.5 8.5 0 019.2 0l.4 1.6a1.5 1.5 0 001.2 1.1l2.3.4a1 1 0 00.9-1.4C20.5 9 16.7 7 12 7S3.5 9 2.6 13.1a1 1 0 00.9 1.4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
