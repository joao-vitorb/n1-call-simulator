import { useEffect, useRef } from 'react';
import type { CallEntry } from '../../types/trainingCall';

export type CallStatus =
  | 'idle'
  | 'listening'
  | 'speaking'
  | 'thinking'
  | 'muted'
  | 'unsupported'
  | 'error';

type CallTranscriptProps = {
  call: CallEntry;
  status: CallStatus;
  error: string | null;
};

const STATUS_LABEL: Record<CallStatus, string> = {
  idle: 'Aguardando início da ligação.',
  listening: 'Ouvindo… fale naturalmente.',
  speaking: 'Cliente falando…',
  thinking: 'Cliente está pensando…',
  muted: 'Microfone mutado.',
  unsupported: 'Microfone não suportado neste navegador (use Chrome ou Edge).',
  error: 'Erro no microfone.',
};

export function CallTranscript({ call, status, error }: CallTranscriptProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [call.messages.length]);

  return (
    <section className="flex max-h-72 flex-col border-b border-zinc-200 bg-zinc-50">
      <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-3">
          {call.messages.map((message, index) => (
            <li
              key={`${message.timestamp}-${index}`}
              className={message.role === 'customer' ? 'flex justify-start' : 'flex justify-end'}
            >
              <div
                className={`max-w-md rounded-lg px-3 py-2 text-sm ${
                  message.role === 'customer'
                    ? 'bg-white text-zinc-800 shadow-sm'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                <p className="mb-0.5 text-[10px] uppercase tracking-wide opacity-70">
                  {message.role === 'customer' ? call.scenario.contactName : 'Você'}
                </p>
                <p>{message.text}</p>
              </div>
            </li>
          ))}
          {status === 'thinking' && (
            <li className="flex justify-start">
              <div className="rounded-lg bg-white px-3 py-2 text-sm text-zinc-500 shadow-sm">
                {call.scenario.contactName} está pensando…
              </div>
            </li>
          )}
        </ul>
      </div>

      <div className="flex items-center gap-3 border-t border-zinc-200 bg-white px-4 py-3 text-xs">
        <StatusBadge status={status} />
        <span className="text-zinc-500">{STATUS_LABEL[status]}</span>
        {error && <span className="text-red-600">{error}</span>}
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: CallStatus }) {
  const color =
    status === 'listening'
      ? 'bg-emerald-500'
      : status === 'speaking'
      ? 'bg-blue-500'
      : status === 'thinking'
      ? 'bg-amber-500'
      : status === 'muted'
      ? 'bg-red-500'
      : status === 'error'
      ? 'bg-red-500'
      : 'bg-zinc-300';

  return <span className={`h-2 w-2 shrink-0 rounded-full ${color}`} />;
}
