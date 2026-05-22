import { useState, type FormEvent } from 'react';
import type { CompanySearchProps, SearchType } from '../../utils/search';

export function CompanySearchCard({
  fields,
  onFieldChange,
  onSearch,
  onClear,
  searchError,
}: CompanySearchProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const candidates: { type: SearchType; value: string }[] = [
      { type: 'legalName', value: fields.legalName.trim() },
      { type: 'cnpj', value: fields.cnpj.trim() },
      { type: 'protocol', value: fields.protocol.trim() },
      { type: 'circuit', value: fields.circuit.trim() },
    ];
    const entries = candidates.filter((entry) => entry.value !== '');

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
    setLocalError(null);
    onClear();
  }

  const displayedError = localError ?? searchError;

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="space-y-3">
        <SearchField
          label="Razão social"
          value={fields.legalName}
          onChange={(value) => onFieldChange('legalName', value)}
        />
        <SearchField
          label="CNPJ"
          value={fields.cnpj}
          onChange={(value) => onFieldChange('cnpj', value)}
          mono
        />
        <SearchField
          label="Protocolo"
          value={fields.protocol}
          onChange={(value) => onFieldChange('protocol', value)}
          mono
        />
        <SearchField
          label="Circuito"
          value={fields.circuit}
          onChange={(value) => onFieldChange('circuit', value)}
          mono
        />
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Limpar
        </button>
      </div>

      {displayedError && <p className="mt-3 text-sm text-red-600">{displayedError}</p>}
    </form>
  );
}

type SearchFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  mono?: boolean;
};

function SearchField({ label, value, onChange, mono }: SearchFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
          mono ? 'font-mono' : ''
        }`}
      />
    </label>
  );
}
