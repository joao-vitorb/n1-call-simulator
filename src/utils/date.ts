const FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return FORMATTER.format(date);
}

export type SlaRemaining = {
  label: string;
  expired: boolean;
};

export function formatSlaRemaining(dueAt: string): SlaRemaining {
  const due = new Date(dueAt).getTime();
  if (Number.isNaN(due)) return { label: '—', expired: false };

  const diff = due - Date.now();
  if (diff <= 0) {
    const elapsed = Math.abs(diff);
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    return { label: `Vencida há ${hours}h`, expired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) {
    return { label: `Restam ${hours}h${minutes.toString().padStart(2, '0')}min`, expired: false };
  }
  return { label: `Restam ${minutes}min`, expired: false };
}
