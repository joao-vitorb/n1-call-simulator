import { useState, type FormEvent } from 'react';
import { generateOsNumber } from '../../../utils/osGenerator';
import { FormField, FormSelect } from './FormControls';
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
      <form onSubmit={handlePage1} className="space-y-3">
        <p className="text-xs text-zinc-500">Página 1 de 3</p>
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
            Avançar
          </button>
        </div>
      </form>
    );
  }

  if (page === 2) {
    return (
      <form onSubmit={handlePage2} className="space-y-3">
        <p className="text-xs text-zinc-500">Página 2 de 3 — modem com defeito</p>
        <FormSelect
          label="Deseja realmente abrir uma ordem de serviço?"
          value={confirmOs}
          options={['Sim', 'Não']}
          onChange={setConfirmOs}
        />
        <FormField label="Telefone de contato" value={phone} onChange={setPhone} />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setPage(1)}
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Voltar
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

  return (
    <form onSubmit={handlePage3} className="space-y-3">
      <p className="text-xs text-zinc-500">Página 3 de 3 — validação inicial</p>
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
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => setPage(1)}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Voltar
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
