import { useEffect, useState, type FormEvent } from 'react';
import type { SomScope, SomSearchFilters } from '../../utils/serviceOrders';

type SomSearchFormProps = {
  scope: SomScope;
  onSearch: (filters: SomSearchFilters) => void;
  onClear: () => void;
};

export function SomSearchForm({ scope, onSearch, onClear }: SomSearchFormProps) {
  const [protocol, setProtocol] = useState('');
  const [osNumber, setOsNumber] = useState('');
  const [circuit, setCircuit] = useState('');
  const [cnpj, setCnpj] = useState('');

  useEffect(() => {
    setProtocol('');
    setOsNumber('');
    setCircuit('');
    setCnpj('');
  }, [scope]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch({ protocol, serviceOrderNumber: osNumber, circuit, cnpj });
  }

  function handleClear() {
    setProtocol('');
    setOsNumber('');
    setCircuit('');
    setCnpj('');
    onClear();
  }

  const title = scope === 'busca' ? 'Busca de OS' : 'Busca de ordens de serviço B2B';
  const protocolLabel = scope === 'busca' ? 'Protocolo (ou número da OS)' : 'Protocolo';
  const gridCols = scope === 'busca-b2b' ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-200 bg-white p-5">
      <p className="mb-4 text-sm font-medium text-zinc-700">{title}</p>
      <div className={`grid gap-3 ${gridCols}`}>
        <Field label={protocolLabel} value={protocol} onChange={setProtocol} />
        {scope === 'busca-b2b' && (
          <Field label="Número da OS" value={osNumber} onChange={setOsNumber} />
        )}
        <Field label="Circuito" value={circuit} onChange={setCircuit} />
        <Field label="CNPJ" value={cnpj} onChange={setCnpj} />
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Limpar
        </button>
      </div>
    </form>
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
