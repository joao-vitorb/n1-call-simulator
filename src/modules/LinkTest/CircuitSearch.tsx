import { useState, type FormEvent } from 'react';

type CircuitSearchProps = {
  onSearch: (circuit: string) => void;
  disabled?: boolean;
};

export function CircuitSearch({ onSearch, disabled }: CircuitSearchProps) {
  const [circuit, setCircuit] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!circuit.trim()) return;
    onSearch(circuit);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="border-b border-zinc-200 px-6 py-4">
        <h3 className="text-sm font-semibold text-zinc-900">Teste de circuito</h3>
        <p className="mt-0.5 text-xs text-zinc-500">
          Informe o número do circuito de Internet Link para iniciar o teste.
        </p>
      </div>

      <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-zinc-500">Circuito</span>
          <input
            type="text"
            value={circuit}
            onChange={(event) => setCircuit(event.target.value)}
            placeholder="Digite o número do circuito"
            disabled={disabled}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm text-zinc-900 outline-none transition-colors placeholder:font-sans focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-zinc-50"
          />
        </label>
        <button
          type="submit"
          disabled={disabled}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Testar
        </button>
      </div>
    </form>
  );
}
