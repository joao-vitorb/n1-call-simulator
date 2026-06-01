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

const STATUS_DOT: Record<CallStatus, string> = {
  idle: 'bg-zinc-300',
  listening: 'bg-emerald-500',
  speaking: 'bg-indigo-500',
  thinking: 'bg-amber-500',
  muted: 'bg-red-500',
  unsupported: 'bg-zinc-300',
  error: 'bg-red-500',
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
    <section className="flex max-h-80 shrink-0 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white animate-fade-in">
      <div className="border-b border-zinc-200 px-5 py-3">
        <h3 className="text-sm font-semibold text-zinc-900">Conversa</h3>
      </div>

      <div ref={scrollerRef} className="flex-1 overflow-y-auto bg-zinc-50/50 p-4">
        <ul className="space-y-3">
          {call.messages.map((message, index) => (
            <li
              key={`${message.timestamp}-${index}`}
              className={message.role === 'customer' ? 'flex justify-start' : 'flex justify-end'}
            >
              <div
                className={`max-w-md rounded-2xl px-3.5 py-2 text-sm ${
                  message.role === 'customer'
                    ? 'rounded-tl-sm bg-white text-zinc-800 ring-1 ring-zinc-200'
                    : 'rounded-tr-sm bg-indigo-600 text-white'
                }`}
              >
                <p
                  className={`mb-0.5 text-[10px] font-medium uppercase tracking-wide ${
                    message.role === 'customer' ? 'text-zinc-400' : 'text-indigo-200'
                  }`}
                >
                  {message.role === 'customer' ? call.scenario.contactName : 'Você'}
                </p>
                <p>{message.text}</p>
              </div>
            </li>
          ))}
          {status === 'thinking' && (
            <li className="flex justify-start">
              <div className="rounded-2xl rounded-tl-sm bg-white px-3.5 py-2 text-sm text-zinc-400 ring-1 ring-zinc-200">
                {call.scenario.contactName} está pensando…
              </div>
            </li>
          )}
        </ul>
      </div>

      <div className="flex items-center gap-2 border-t border-zinc-200 px-5 py-3 text-xs">
        <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[status]}`} />
        <span className="text-zinc-500">{STATUS_LABEL[status]}</span>
        {error && <span className="text-red-600">{error}</span>}
      </div>
    </section>
  );
}
