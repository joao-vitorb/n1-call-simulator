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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProtocol('');
    setOsNumber('');
    setCircuit('');
    setCnpj('');
    setError(null);
  }, [scope]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!protocol.trim() && !osNumber.trim() && !circuit.trim() && !cnpj.trim()) {
      setError('Preencha pelo menos um filtro para buscar.');
      return;
    }
    setError(null);
    onSearch({ protocol, serviceOrderNumber: osNumber, circuit, cnpj });
  }

  function handleClear() {
    setProtocol('');
    setOsNumber('');
    setCircuit('');
    setCnpj('');
    setError(null);
    onClear();
  }

  const title = scope === 'busca' ? 'Busca de OS' : 'Busca de ordens de serviço B2B';
  const protocolLabel = scope === 'busca' ? 'Protocolo (ou número da OS)' : 'Protocolo';
  const gridCols = scope === 'busca-b2b' ? 'sm:grid-cols-4' : 'sm:grid-cols-3';

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-200 bg-white animate-fade-in"
    >
      <div className="border-b border-zinc-200 px-6 py-4">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      </div>

      <div className={`grid grid-cols-1 gap-4 px-6 py-5 ${gridCols}`}>
        <Field label={protocolLabel} value={protocol} onChange={setProtocol} />
        {scope === 'busca-b2b' && (
          <Field label="Número da OS" value={osNumber} onChange={setOsNumber} />
        )}
        <Field label="Circuito" value={circuit} onChange={setCircuit} />
        <Field label="CNPJ" value={cnpj} onChange={setCnpj} />
      </div>

      <div className="flex items-center gap-3 border-t border-zinc-200 px-6 py-4">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Limpar
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
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
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
    </label>
  );
}
