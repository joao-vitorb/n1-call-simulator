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
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <label className="flex-1">
        <span className="mb-1 block text-xs font-medium text-zinc-500">Circuito</span>
        <input
          type="text"
          value={circuit}
          onChange={(event) => setCircuit(event.target.value)}
          placeholder="Digite o número do circuito"
          disabled={disabled}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 disabled:bg-zinc-50"
        />
      </label>
      <button
        type="submit"
        disabled={disabled}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60"
      >
        Testar
      </button>
    </form>
  );
}
