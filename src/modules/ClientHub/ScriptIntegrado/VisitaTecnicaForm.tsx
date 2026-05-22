import { useState, type FormEvent } from 'react';
import { generateOsNumber } from '../../../utils/osGenerator';
import { FormActions, FormError, FormSelect, FormTextarea } from './FormControls';
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormSelect
        label="Acesso liberado?"
        value={accessReleased}
        options={['Sim', 'Não']}
        onChange={setAccessReleased}
      />
      <FormTextarea label="Observação" value={observation} onChange={setObservation} rows={6} />
      {error && <FormError>{error}</FormError>}
      <FormActions primaryLabel="Concluir" secondaryLabel="Cancelar" onSecondary={onCancel} />
    </form>
  );
}
