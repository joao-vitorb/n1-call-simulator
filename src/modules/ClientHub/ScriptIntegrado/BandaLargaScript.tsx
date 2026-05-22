import { useState, type FormEvent } from 'react';
import { generateOsNumber } from '../../../utils/osGenerator';
import { FormActions, FormError, FormField, FormSelect, FormStep } from './FormControls';
import type { ScriptResult } from './types';

type BandaLargaScriptProps = {
  onComplete: (result: ScriptResult) => void;
  onCancel: () => void;
};

export function BandaLargaScript({ onComplete, onCancel }: BandaLargaScriptProps) {
  const [page, setPage] = useState<1 | 2 | 3>(1);
  const [hasDefectiveModem, setHasDefectiveModem] = useState('');
  const [wantsOs, setWantsOs] = useState('');
  const [confirmOs, setConfirmOs] = useState('');
  const [phone, setPhone] = useState('');
  const [resetDone, setResetDone] = useState('');
  const [powerChecked, setPowerChecked] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handlePage1(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasDefectiveModem || !wantsOs) {
      setError('Preencha os dois campos.');
      return;
    }
    setError(null);

    if (wantsOs === 'Não') {
      onComplete({ kind: 'os-not-opened' });
      return;
    }
    setPage(hasDefectiveModem === 'Sim' ? 2 : 3);
  }

  function handlePage2(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmOs) {
      setError('Confirme a abertura.');
      return;
    }
    setError(null);
    if (confirmOs === 'Sim') {
      onComplete({ kind: 'os-opened', osNumber: generateOsNumber() });
    } else {
      onComplete({ kind: 'os-not-opened' });
    }
  }

  function handlePage3(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resetDone || !powerChecked) {
      setError('Preencha os dois campos.');
      return;
    }
    setError(null);
    if (resetDone === 'Sim' && powerChecked === 'Sim') {
      onComplete({ kind: 'os-opened', osNumber: generateOsNumber() });
    } else {
      onComplete({ kind: 'os-not-opened' });
    }
  }

  if (page === 1) {
    return (
      <form onSubmit={handlePage1} className="space-y-4">
        <FormStep current={1} total={3} />
        <FormSelect
          label="Modem com defeito?"
          value={hasDefectiveModem}
          options={['Sim', 'Não']}
          onChange={setHasDefectiveModem}
        />
        <FormSelect
          label="Deseja realmente abrir uma ordem de serviço?"
          value={wantsOs}
          options={['Sim', 'Não']}
          onChange={setWantsOs}
        />
        {error && <FormError>{error}</FormError>}
        <FormActions primaryLabel="Avançar" secondaryLabel="Cancelar" onSecondary={onCancel} />
      </form>
    );
  }

  if (page === 2) {
    return (
      <form onSubmit={handlePage2} className="space-y-4">
        <FormStep current={2} total={3} hint="modem com defeito" />
        <FormSelect
          label="Deseja realmente abrir uma ordem de serviço?"
          value={confirmOs}
          options={['Sim', 'Não']}
          onChange={setConfirmOs}
        />
        <FormField label="Telefone de contato" value={phone} onChange={setPhone} mono />
        {error && <FormError>{error}</FormError>}
        <FormActions
          primaryLabel="Concluir"
          secondaryLabel="Voltar"
          onSecondary={() => setPage(1)}
        />
      </form>
    );
  }

  return (
    <form onSubmit={handlePage3} className="space-y-4">
      <FormStep current={3} total={3} hint="validação inicial" />
      <FormSelect
        label="Realizado reset no equipamento?"
        value={resetDone}
        options={['Sim', 'Não']}
        onChange={setResetDone}
      />
      <FormSelect
        label="Validado energia no local?"
        value={powerChecked}
        options={['Sim', 'Não']}
        onChange={setPowerChecked}
      />
      {error && <FormError>{error}</FormError>}
      <FormActions
        primaryLabel="Concluir"
        secondaryLabel="Voltar"
        onSecondary={() => setPage(1)}
      />
    </form>
  );
}
