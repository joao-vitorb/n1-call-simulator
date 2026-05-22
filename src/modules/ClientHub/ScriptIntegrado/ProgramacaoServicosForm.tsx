import { useState, type FormEvent } from 'react';
import { generateOsNumber } from '../../../utils/osGenerator';
import { FormActions, FormCheckbox, FormError, FormTextarea } from './FormControls';
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
    onComplete({ kind: 'os-opened', osNumber: generateOsNumber(), observation });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormCheckbox label="First call resolution" checked={fcr} onChange={setFcr} />
      <FormTextarea label="Observação" value={observation} onChange={setObservation} rows={6} />
      {error && <FormError>{error}</FormError>}
      <FormActions primaryLabel="Concluir" secondaryLabel="Cancelar" onSecondary={onCancel} />
    </form>
  );
}
