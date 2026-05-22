import { useEffect, useMemo, useState } from 'react';
import type { Company } from '../../types/company';
import type { Contract } from '../../types/contract';

const PER_PAGE = 10;
const MAX_PAGES = 20;

type CompanyContractsProps = {
  company: Company;
  selectedContract: Contract | null;
  onSelectContract: (contract: Contract | null) => void;
};

export function CompanyContracts({
  company,
  selectedContract,
  onSelectContract,
}: CompanyContractsProps) {
  const [circuitFilter, setCircuitFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [applied, setApplied] = useState({ circuit: '', address: '', status: '' });
  const [page, setPage] = useState(1);

  const hasActiveFilter = Boolean(applied.circuit || applied.address || applied.status);

  const filtered = useMemo(() => {
    return company.contracts.filter((contract) => {
      if (applied.circuit && !contract.circuit.includes(applied.circuit.trim())) return false;
      if (
        applied.address &&
        !contract.address.fullAddress.toLowerCase().includes(applied.address.trim().toLowerCase())
      )
        return false;
      if (applied.status && contract.status !== applied.status) return false;
      return true;
    });
  }, [company.contracts, applied]);

  const cappedTotal = hasActiveFilter ? filtered.length : Math.min(filtered.length, PER_PAGE * MAX_PAGES);
  const totalPages = Math.max(1, Math.ceil(cappedTotal / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  const overLimit = !hasActiveFilter && filtered.length > PER_PAGE * MAX_PAGES;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function applyFilters() {
    setApplied({ circuit: circuitFilter, address: addressFilter, status: statusFilter });
    setPage(1);
  }

  function clearFilters() {
    setCircuitFilter('');
    setAddressFilter('');
    setStatusFilter('');
    setApplied({ circuit: '', address: '', status: '' });
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900">Filtros</h3>
        <div className="grid grid-cols-3 gap-4">
          <FilterField label="Circuito" value={circuitFilter} onChange={setCircuitFilter} mono />
          <FilterField label="Endereço" value={addressFilter} onChange={setAddressFilter} />
          <FilterSelect
            label="Status do contrato"
            value={statusFilter}
            options={['Ativo', 'Cancelado']}
            onChange={setStatusFilter}
          />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={applyFilters}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Buscar
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

      {overLimit && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Exibindo os primeiros {PER_PAGE * MAX_PAGES} contratos. Use os filtros de circuito ou
          endereço para localizar os demais.
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left text-xs font-medium text-zinc-500">
              <th className="px-6 py-3">Contrato</th>
              <th className="px-6 py-3">Produto</th>
              <th className="px-6 py-3">Circuito</th>
              <th className="px-6 py-3">Endereço</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-sm text-zinc-500">
                  Nenhum contrato encontrado.
                </td>
              </tr>
            )}
            {pageItems.map((contract) => {
              const isSelected = selectedContract?.id === contract.id;
              return (
                <tr
                  key={contract.id}
                  className={`border-b border-zinc-100 last:border-b-0 transition-colors ${
                    isSelected ? 'bg-indigo-50/50' : 'hover:bg-zinc-50/60'
                  }`}
                >
                  <td className="px-6 py-3">
                    <button
                      type="button"
                      onClick={() => onSelectContract(isSelected ? null : contract)}
                      className="font-mono text-sm font-medium text-indigo-700 transition-colors hover:text-indigo-800 hover:underline"
                    >
                      {contract.contractNumber}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-sm text-zinc-900">{contract.productName}</td>
                  <td className="px-6 py-3 font-mono text-sm text-zinc-700">{contract.circuit}</td>
                  <td className="px-6 py-3 text-sm text-zinc-700">{contract.address.fullAddress}</td>
                  <td className="px-6 py-3 text-sm">
                    <ContractStatusPill status={contract.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-3 text-sm">
            <span className="text-zinc-500">
              Página {safePage} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </section>

      {selectedContract && (
        <section className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-white p-6 animate-slide-up">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
              <h3 className="text-sm font-semibold text-indigo-900">Contrato selecionado</h3>
            </div>
            <span className="font-mono text-sm text-indigo-700">
              {selectedContract.contractNumber}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            <Info label="Produto" value={selectedContract.productName} />
            <Info label="Data de contratação" value={selectedContract.hiredAt} mono />
            <Info label="Data de cancelamento" value={selectedContract.canceledAt ?? '—'} mono />
            <Info label="Data de instalação" value={selectedContract.installedAt} mono />
            <Info label="Regional" value={selectedContract.regional} />
            <Info label="SLA" value={`${selectedContract.slaHours}h`} mono />
          </div>
        </section>
      )}
    </div>
  );
}

type FilterFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  mono?: boolean;
};

function FilterField({ label, value, onChange, mono }: FilterFieldProps) {
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

type FilterSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">—</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

type InfoProps = {
  label: string;
  value: string;
  mono?: boolean;
};

function Info({ label, value, mono }: InfoProps) {
  return (
    <div>
      <p className="mb-0.5 text-xs font-medium text-zinc-500">{label}</p>
      <p className={`text-sm text-zinc-900 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}

function ContractStatusPill({ status }: { status: string }) {
  const active = status === 'Ativo';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
        active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-red-500'}`}
      />
      {status}
    </span>
  );
}
