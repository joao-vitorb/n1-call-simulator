import { useState, type ReactNode } from 'react';
import { findCompanyByOrder } from '../../utils/serviceOrders';
import { formatDateTime, formatSlaRemaining } from '../../utils/date';
import { parseCustomerPhone } from '../../utils/protocols';
import { useAuth } from '../../contexts/AuthContext';
import { useTicketUpdates } from '../../contexts/TicketUpdatesContext';
import { buildJourneyNotes, resolveStatus } from '../../utils/ticketJourney';
import type { ServiceOrder } from '../../types/serviceOrder';
import { SomStatusPill } from './SomStatusPill';
import { ReexecuteModal, type ReexecuteInput } from './ReexecuteModal';

type SomOrderPageProps = {
  order: ServiceOrder;
  onBack: () => void;
};

export function SomOrderPage({ order: baseOrder, onBack }: SomOrderPageProps) {
  const { currentUser } = useAuth();
  const { mergeOrder, updateTicket } = useTicketUpdates();
  const overlaid = mergeOrder({ ...baseOrder, notes: [] });
  const order = {
    ...overlaid,
    status: resolveStatus(overlaid),
    notes: [...buildJourneyNotes(overlaid), ...overlaid.notes],
  };
  const company = findCompanyByOrder(order);
  const remaining = formatSlaRemaining(order.dueAt);

  const [noteText, setNoteText] = useState('');
  const [showReexecute, setShowReexecute] = useState(false);
  const author = currentUser?.username ?? 'atendente';
  const canReexecute = order.stage === 'Aceite';

  function handleAddNote() {
    const text = noteText.trim();
    if (!text) return;
    updateTicket(order.serviceOrderNumber, {
      note: { createdAt: new Date().toISOString(), author, text },
    });
    setNoteText('');
  }

  function handleEscalate() {
    updateTicket(order.serviceOrderNumber, {
      note: {
        createdAt: new Date().toISOString(),
        author,
        text: 'Cliente solicitou prioridade. Chamado escalonado.',
      },
    });
  }

  function handleReexecute(input: ReexecuteInput) {
    updateTicket(order.serviceOrderNumber, {
      status: 'Aberto',
      stage: 'Investigação dados',
      finishedAt: null,
      contact: {
        name: input.name,
        phone: parseCustomerPhone(input.phone),
        email: order.contact.email,
      },
      note: { createdAt: new Date().toISOString(), author, text: input.observation },
    });
    setShowReexecute(false);
  }

  return (
    <section className="flex flex-1 flex-col gap-4 overflow-y-auto bg-zinc-50 p-6">
      <button
        type="button"
        onClick={onBack}
        className="self-start rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
      >
        ← Voltar
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3 animate-fade-in">
        <div>
          <p className="font-mono text-lg font-semibold text-zinc-900">
            {order.serviceOrderNumber}
          </p>
          <p className="mt-0.5 text-sm text-zinc-500">{order.type} · {order.customerLegalName}</p>
        </div>
        <SomStatusPill status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Cliente">
          <Info label="Razão social" value={order.customerLegalName} />
          <Info label="CNPJ" value={order.cnpj} mono />
          <Info label="Segmento" value={company?.segment ?? '—'} />
          <Info label="Sub-segmento" value={company?.subSegment ?? '—'} />
          <Info label="GTD" value={company ? (company.isGtd ? 'Sim' : 'Não') : '—'} />

          <Divider>Contato</Divider>
          <Info label="Nome" value={order.contact.name} />
          <Info
            label="Telefone"
            value={`(${order.contact.phone.ddd}) ${order.contact.phone.number}`}
            mono
          />
          <Info label="E-mail" value={order.contact.email} />
        </Card>

        <Card title="Ordem de serviço">
          <Info label="Protocolo" value={order.protocol} mono />
          <Info label="Número da OS" value={order.serviceOrderNumber} mono />
          <Info label="Tipo" value={order.type} />
          <Info label="Localidade" value={order.locality} />
          <Info label="Circuito" value={order.circuit} mono />
          <Info label="Subscrição" value={order.contractNumber} mono />
          <Info label="Produto" value={order.product} />
          <Info label="Data de instalação" value={order.installationDate} />

          <Divider>Estágio atual</Divider>
          <p className="text-sm font-medium text-zinc-900">{order.stage}</p>
        </Card>

        <Card title="Status">
          <Info label="Status" value={order.status} />
          <div className="mb-2">
            <p className="text-xs font-medium text-zinc-500">Vencimento</p>
            <p className="mt-0.5 font-medium text-zinc-900">{formatDateTime(order.dueAt)}</p>
            <p
              className={`mt-1 text-xs font-medium ${
                remaining.expired ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              {remaining.label}
            </p>
          </div>

          <Divider>Datas</Divider>
          <Info label="Criado em" value={formatDateTime(order.createdAt)} />
          <Info label="Criado por" value={order.createdBy} />
          <Info label="Finalizado em" value={formatDateTime(order.finishedAt)} />
        </Card>
      </div>

      <Card title="Ações">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleEscalate}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Escalonar chamado
          </button>
          <button
            type="button"
            onClick={() => setShowReexecute(true)}
            disabled={!canReexecute}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reexecutar chamado
          </button>
          {!canReexecute && (
            <span className="self-center text-xs text-zinc-400">
              Reexecução disponível apenas na etapa Aceite.
            </span>
          )}
        </div>

        <Divider>Adicionar observação</Divider>
        <textarea
          value={noteText}
          onChange={(event) => setNoteText(event.target.value)}
          rows={3}
          placeholder="Escreva uma observação para o chamado…"
          className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <div className="mt-3">
          <button
            type="button"
            onClick={handleAddNote}
            disabled={!noteText.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Salvar observação
          </button>
        </div>
      </Card>

      <div className="rounded-xl border border-zinc-200 bg-white animate-fade-in">
        <div className="border-b border-zinc-200 px-6 py-4">
          <h3 className="text-sm font-semibold text-zinc-900">Observações</h3>
        </div>
        <div className="px-6 py-5">
          {order.notes.length === 0 ? (
            <p className="text-sm text-zinc-500">Sem observações registradas.</p>
          ) : (
            <ul className="space-y-3">
              {order.notes.map((note, index) => (
                <li
                  key={`${note.createdAt}-${index}`}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                >
                  <p className="text-xs text-zinc-500">
                    {formatDateTime(note.createdAt)} · {note.author}
                  </p>
                  <p className="mt-1 text-sm text-zinc-800">{note.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showReexecute && (
        <ReexecuteModal
          orderNumber={order.serviceOrderNumber}
          onConfirm={handleReexecute}
          onClose={() => setShowReexecute(false)}
        />
      )}
    </section>
  );
}

type CardProps = {
  title: string;
  children: ReactNode;
};

function Card({ title, children }: CardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white animate-fade-in">
      <div className="border-b border-zinc-200 px-6 py-4">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Divider({ children }: { children: string }) {
  return (
    <p className="mb-3 mt-5 text-xs font-medium uppercase tracking-wide text-zinc-400">
      {children}
    </p>
  );
}

type InfoProps = {
  label: string;
  value: string;
  mono?: boolean;
};

function Info({ label, value, mono }: InfoProps) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className={`mt-0.5 break-words font-medium text-zinc-900 ${mono ? 'font-mono text-sm' : ''}`}>
        {value}
      </p>
    </div>
  );
}
