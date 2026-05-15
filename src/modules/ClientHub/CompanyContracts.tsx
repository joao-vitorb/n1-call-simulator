import { useMemo, useState } from 'react';
import type { Company } from '../../types/company';
import type { Contract } from '../../types/contract';

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

  const filtered = useMemo(() => {
    return company.contracts.filter((contract) => {
      if (applied.circuit && !contract.circuit.includes(applied.circuit.trim())) {
        return false;
      }
      if (
        applied.address &&
        !contract.address.fullAddress.toLowerCase().includes(applied.address.trim().toLowerCase())
      ) {
        return false;
      }
      if (applied.status && contract.status !== applied.status) {
        return false;
      }
      return true;
    });
  }, [company.contracts, applied]);

  function applyFilters() {
    setApplied({ circuit: circuitFilter, address: addressFilter, status: statusFilter });
  }

  function clearFilters() {
    setCircuitFilter('');
    setAddressFilter('');
    setStatusFilter('');
    setApplied({ circuit: '', address: '', status: '' });
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <p className="mb-3 text-sm font-medium text-zinc-700">Filtros</p>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Circuito" value={circuitFilter} onChange={setCircuitFilter} />
          <Field label="Endereço" value={addressFilter} onChange={setAddressFilter} />
          <SelectField
            label="Status do contrato"
            value={statusFilter}
            options={['Ativo', 'Cancelado']}
            onChange={setStatusFilter}
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={applyFilters}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Limpar
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-5 py-2">Número do contrato</th>
              <th className="px-5 py-2">Produto</th>
              <th className="px-5 py-2">Circuito</th>
              <th className="px-5 py-2">Endereço</th>
              <th className="px-5 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-4 text-center text-zinc-500">
                  Nenhum contrato encontrado.
                </td>
              </tr>
            )}
            {filtered.map((contract) => {
              const isSelected = selectedContract?.id === contract.id;
              return (
                <tr
                  key={contract.id}
                  className={`border-b border-zinc-100 ${
                    isSelected ? 'bg-emerald-50' : 'hover:bg-zinc-50'
                  }`}
                >
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => onSelectContract(isSelected ? null : contract)}
                      className="font-medium text-emerald-700 hover:underline"
                    >
                      {contract.contractNumber}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-zinc-800">{contract.productName}</td>
                  <td className="px-5 py-3 text-zinc-800">{contract.circuit}</td>
                  <td className="px-5 py-3 text-zinc-800">{contract.address.fullAddress}</td>
                  <td className="px-5 py-3 text-zinc-800">{contract.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {selectedContract && (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="mb-3 text-sm font-medium text-emerald-800">Contrato selecionado</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <Info label="Produto" value={selectedContract.productName} />
            <Info label="Data de contratação" value={selectedContract.hiredAt} />
            <Info label="Data de cancelamento" value={selectedContract.canceledAt ?? '—'} />
            <Info label="Data de instalação" value={selectedContract.installedAt} />
            <Info label="Regional" value={selectedContract.regional} />
            <Info label="SLA" value={`${selectedContract.slaHours}h`} />
          </div>
        </section>
      )}
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function Field({ label, value, onChange }: FieldProps) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs text-zinc-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-zinc-900 outline-none focus:border-zinc-500"
      />
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-zinc-900 outline-none focus:border-zinc-500"
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
};

function Info({ label, value }: InfoProps) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="font-medium text-zinc-900">{value}</p>
    </div>
  );
}
