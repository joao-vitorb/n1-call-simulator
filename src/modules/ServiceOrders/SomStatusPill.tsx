type Tone = 'indigo' | 'amber' | 'emerald' | 'red' | 'zinc';

const TONE_CLASS: Record<Tone, string> = {
  indigo: 'bg-indigo-50 text-indigo-700',
  amber: 'bg-amber-50 text-amber-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-700',
  zinc: 'bg-zinc-100 text-zinc-600',
};

const DOT_CLASS: Record<Tone, string> = {
  indigo: 'bg-indigo-500',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  red: 'bg-red-500',
  zinc: 'bg-zinc-400',
};

function toneForStatus(status: string): Tone {
  const value = status.toLowerCase();
  if (value.includes('cancel')) return 'red';
  if (value.includes('finaliz') || value.includes('conclu') || value.includes('encerr') || value.includes('resolv')) {
    return 'emerald';
  }
  if (value.includes('andamento') || value.includes('execu') || value.includes('investiga') || value.includes('pend')) {
    return 'amber';
  }
  if (value.includes('aberto')) return 'indigo';
  return 'zinc';
}

type SomStatusPillProps = {
  status: string;
};

export function SomStatusPill({ status }: SomStatusPillProps) {
  const tone = toneForStatus(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE_CLASS[tone]}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${DOT_CLASS[tone]}`} />
      {status}
    </span>
  );
}
