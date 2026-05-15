import { useState, type FormEvent } from 'react';
import { generateOsNumber } from '../../../utils/osGenerator';
import { FormTextarea } from './FormControls';
import type { ScriptResult } from './types';

type ProgramacaoServicosFormProps = {
  onComplete: (result: ScriptResult) => void;
  onCancel: () => void;
};

export function ProgramacaoServicosForm({ onComplete, onCancel }: ProgramacaoServicosFormProps) {
  const [fcr, setFcr] = useState(false);
  const [observation, setObservation] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (observation.split('\n').length > 100) {
      setError('Observação não pode ter mais de 100 linhas.');
      return;
    }
    setError(null);
    onComplete({ kind: 'os-opened', osNumber: generateOsNumber() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={fcr}
          onChange={(event) => setFcr(event.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400"
        />
        First call resolution
      </label>

      <FormTextarea label="Observação" value={observation} onChange={setObservation} rows={6} />

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Concluir
        </button>
      </div>
    </form>
  );
}
