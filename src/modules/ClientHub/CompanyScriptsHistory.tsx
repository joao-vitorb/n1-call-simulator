import { useMemo, useState } from 'react';
import { useCreatedOrders } from '../../contexts/CreatedOrdersContext';
import { buildScriptHistory, withinPeriod } from '../../utils/history';
import { formatDateTime } from '../../utils/date';
import type { Company } from '../../types/company';

type CompanyScriptsHistoryProps = {
  company: Company;
};

export function CompanyScriptsHistory({ company }: CompanyScriptsHistoryProps) {
  const { createdOrders } = useCreatedOrders();
  const rows = useMemo(() => buildScriptHistory(company, createdOrders), [company, createdOrders]);

  const [protocol, setProtocol] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [applied, setApplied] = useState({ protocol: '', from: '', to: '' });

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (applied.protocol && !row.protocol.includes(applied.protocol.trim())) return false;
      if (!withinPeriod(row.createdAt, applied.from, applied.to)) return false;
      return true;
    });
  }, [rows, applied]);

  function applyFilters() {
    setApplied({ protocol, from, to });
  }

  function clearFilters() {
    setProtocol('');
    setFrom('');
    setTo('');
    setApplied({ protocol: '', from: '', to: '' });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900">Histórico script integrado</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Protocolo" value={protocol} onChange={setProtocol} mono />
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
                  Nenhuma OS encontrada.
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
                <td className="px-5 py-3 text-sm text-zinc-700">{formatDateTime(row.createdAt)}</td>
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
