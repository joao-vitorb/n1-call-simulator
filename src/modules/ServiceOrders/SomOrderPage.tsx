import { findCompanyByOrder } from '../../utils/serviceOrders';
import { formatDateTime, formatSlaRemaining } from '../../utils/date';
import type { ServiceOrder } from '../../types/serviceOrder';

type SomOrderPageProps = {
  order: ServiceOrder;
  onBack: () => void;
};

export function SomOrderPage({ order, onBack }: SomOrderPageProps) {
  const company = findCompanyByOrder(order);
  const remaining = formatSlaRemaining(order.dueAt);

  return (
    <section className="flex flex-1 flex-col gap-4 overflow-y-auto bg-zinc-50 p-6">
      <button
        type="button"
        onClick={onBack}
        className="self-start rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
      >
        ← Voltar
      </button>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 text-sm">
          <p className="mb-3 text-xs uppercase tracking-wide text-zinc-500">Cliente</p>
          <Info label="Razão social" value={order.customerLegalName} />
          <Info label="CNPJ" value={order.cnpj} />
          <Info label="Segmento" value={company?.segment ?? '—'} />
          <Info label="Sub-segmento" value={company?.subSegment ?? '—'} />
          <Info label="GTD" value={company ? (company.isGtd ? 'Sim' : 'Não') : '—'} />

          <p className="mb-3 mt-5 text-xs uppercase tracking-wide text-zinc-500">Contato</p>
          <Info label="Nome" value={order.contact.name} />
          <Info
            label="Telefone"
            value={`(${order.contact.phone.ddd}) ${order.contact.phone.number}`}
          />
          <Info label="E-mail" value={order.contact.email} />
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 text-sm">
          <p className="mb-3 text-xs uppercase tracking-wide text-zinc-500">Ordem de serviço</p>
          <Info label="Protocolo" value={order.protocol} />
          <Info label="Número da OS" value={order.serviceOrderNumber} />
          <Info label="Tipo" value={order.type} />
          <Info label="Localidade" value={order.locality} />
          <Info label="Circuito" value={order.circuit} />
          <Info label="Subscrição" value={order.contractNumber} />
          <Info label="Produto" value={order.product} />
          <Info label="Data de instalação" value={order.installationDate} />

          <p className="mb-2 mt-5 text-xs uppercase tracking-wide text-zinc-500">Estágio atual</p>
          <p className="text-sm font-medium text-zinc-900">{order.stage}</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 text-sm">
          <p className="mb-3 text-xs uppercase tracking-wide text-zinc-500">Status</p>
          <Info label="Status" value={order.status} />
          <div className="mt-3">
            <p className="text-xs text-zinc-500">Vencimento</p>
            <p className="mt-1 font-medium text-zinc-900">{formatDateTime(order.dueAt)}</p>
            <p
              className={`mt-1 text-xs font-medium ${
                remaining.expired ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              {remaining.label}
            </p>
          </div>

          <p className="mb-3 mt-5 text-xs uppercase tracking-wide text-zinc-500">Datas</p>
          <Info label="Criado em" value={formatDateTime(order.createdAt)} />
          <Info label="Criado por" value={order.createdBy} />
          <Info label="Finalizado em" value={formatDateTime(order.finishedAt)} />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <p className="mb-3 text-sm font-medium text-zinc-700">Observações</p>
        {order.notes.length === 0 ? (
          <p className="text-sm text-zinc-500">Sem observações registradas.</p>
        ) : (
          <ul className="space-y-3">
            {order.notes.map((note, index) => (
              <li
                key={`${note.createdAt}-${index}`}
                className="rounded-md border border-zinc-100 bg-zinc-50 p-3"
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
    </section>
  );
}

type InfoProps = {
  label: string;
  value: string;
};

function Info({ label, value }: InfoProps) {
  return (
    <div className="mb-2">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="font-medium text-zinc-900 break-words">{value}</p>
    </div>
  );
}
