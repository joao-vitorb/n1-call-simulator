import { useState, type FormEvent } from 'react';
import type { SearchType } from '../../utils/search';

type CompanySearchCardProps = {
  onSearch: (type: SearchType, value: string) => void;
  onClear?: () => void;
  searchError: string | null;
};

export function CompanySearchCard({ onSearch, onClear, searchError }: CompanySearchCardProps) {
  const [legalName, setLegalName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [protocol, setProtocol] = useState('');
  const [circuit, setCircuit] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const entries: { type: SearchType; value: string }[] = [
      { type: 'legalName', value: legalName.trim() },
      { type: 'cnpj', value: cnpj.trim() },
      { type: 'protocol', value: protocol.trim() },
      { type: 'circuit', value: circuit.trim() },
    ].filter((entry) => entry.value !== '');

    if (entries.length === 0) {
      setLocalError('Preencha um dos campos para buscar.');
      return;
    }
    if (entries.length > 1) {
      setLocalError('Preencha apenas um dos campos.');
      return;
    }
    setLocalError(null);
    onSearch(entries[0].type, entries[0].value);
  }

  function handleClear() {
    setLegalName('');
    setCnpj('');
    setProtocol('');
    setCircuit('');
    setLocalError(null);
    onClear?.();
  }

  const displayedError = localError ?? searchError;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-sm"
    >
      <p className="mb-3 font-medium text-zinc-700">Buscar empresa</p>
      <div className="flex flex-col gap-2">
        <Field label="Razão social" value={legalName} onChange={setLegalName} />
        <Field label="CNPJ" value={cnpj} onChange={setCnpj} />
        <Field label="Protocolo" value={protocol} onChange={setProtocol} />
        <Field label="Circuito" value={circuit} onChange={setCircuit} />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-md bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 rounded-md border border-zinc-300 bg-white px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Limpar
        </button>
      </div>

      {displayedError && <p className="mt-2 text-xs text-red-600">{displayedError}</p>}
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
      <span className="mb-1 block text-xs text-zinc-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500"
      />
    </label>
  );
}
