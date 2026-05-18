import { useState, type FormEvent } from 'react';
import { generateOsNumber } from '../../../utils/osGenerator';
import { FormSelect, FormTextarea } from './FormControls';
import type { ScriptResult } from './types';

type VisitaTecnicaFormProps = {
  onComplete: (result: ScriptResult) => void;
  onCancel: () => void;
};

export function VisitaTecnicaForm({ onComplete, onCancel }: VisitaTecnicaFormProps) {
  const [accessReleased, setAccessReleased] = useState('');
  const [observation, setObservation] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessReleased) {
      setError('Informe se o acesso está liberado.');
      return;
    }
    if (observation.split('\n').length > 100) {
      setError('Observação não pode ter mais de 100 linhas.');
      return;
    }
    setError(null);
    onComplete({ kind: 'os-opened', osNumber: generateOsNumber(), observation });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <FormSelect
        label="Acesso liberado?"
        value={accessReleased}
        options={['Sim', 'Não']}
        onChange={setAccessReleased}
      />
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
