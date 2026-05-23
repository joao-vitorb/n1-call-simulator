import { useMemo, useState } from 'react';
import { useClientHubData } from '../../contexts/ClientHubDataContext';
import { buildInteractionHistory, withinPeriod } from '../../utils/history';
import { formatDate } from '../../utils/date';
import type { Company } from '../../types/company';

type CompanyInteractionsHistoryProps = {
  company: Company;
};

export function CompanyInteractionsHistory({ company }: CompanyInteractionsHistoryProps) {
  const { interactions } = useClientHubData();
  const rows = useMemo(
    () => buildInteractionHistory(company, interactions),
    [company, interactions],
  );

  const [protocol, setProtocol] = useState('');
  const [ddd, setDdd] = useState('');
  const [phone, setPhone] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [applied, setApplied] = useState({ protocol: '', ddd: '', phone: '', from: '', to: '' });

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (applied.protocol && !row.protocol.includes(applied.protocol.trim())) return false;
      if (applied.ddd && row.ddd !== applied.ddd.trim()) return false;
      if (applied.phone && !row.phone.includes(applied.phone.trim())) return false;
      if (!withinPeriod(row.createdAt, applied.from, applied.to)) return false;
      return true;
    });
  }, [rows, applied]);

  function applyFilters() {
    setApplied({ protocol, ddd, phone, from, to });
  }

  function clearFilters() {
    setProtocol('');
    setDdd('');
    setPhone('');
    setFrom('');
    setTo('');
    setApplied({ protocol: '', ddd: '', phone: '', from: '', to: '' });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900">Histórico de interações</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <Field label="Protocolo" value={protocol} onChange={setProtocol} mono />
          <Field label="DDD" value={ddd} onChange={setDdd} mono />
          <Field label="Telefone" value={phone} onChange={setPhone} mono />
          <DateField label="De" value={from} onChange={setFrom} />
          <DateField label="Até" value={to} onChange={setTo} />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={applyFilters}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Limpar
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left text-xs font-medium text-zinc-500">
              <th className="px-5 py-3">Protocolo</th>
              <th className="px-5 py-3">Parecer</th>
              <th className="px-5 py-3">Contato</th>
              <th className="px-5 py-3">Criado por</th>
              <th className="px-5 py-3">Criado em</th>
              <th className="px-5 py-3">DDD</th>
              <th className="px-5 py-3">Telefone</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-6 text-center text-sm text-zinc-500">
                  Nenhuma interação encontrada.
                </td>
              </tr>
            )}
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-zinc-100 last:border-b-0">
                <td className="px-5 py-3 font-mono text-sm text-zinc-900">{row.protocol}</td>
                <td className="max-w-xs truncate px-5 py-3 text-sm text-zinc-700" title={row.summary}>
                  {row.summary || '—'}
                </td>
                <td className="px-5 py-3 text-sm text-zinc-700">{row.contactName}</td>
                <td className="px-5 py-3 text-sm text-zinc-700">{row.createdBy}</td>
                <td className="px-5 py-3 text-sm text-zinc-700">{formatDate(row.createdAt)}</td>
                <td className="px-5 py-3 font-mono text-sm text-zinc-700">{row.ddd}</td>
                <td className="px-5 py-3 font-mono text-sm text-zinc-700">{row.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  mono?: boolean;
};

function Field({ label, value, onChange, mono }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
          mono ? 'font-mono' : ''
        }`}
      />
    </label>
  );
}

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function DateField({ label, value, onChange }: DateFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-500">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
    </label>
  );
}
