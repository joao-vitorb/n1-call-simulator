import { useState, type FormEvent } from 'react';
import { generateOsNumber } from '../../../utils/osGenerator';
import { FormField, FormSelect, FormTextarea } from './FormControls';
import type { ScriptResult } from './types';

const PROBLEM_OPTIONS = ['Inoperante', 'Intermitente', 'Lentidão', 'Navegação', 'Autenticação'];
const IMPACT_OPTIONS = ['Baixo', 'Médio', 'Alto', 'Crítico'];

type InternetLinkScriptProps = {
  onComplete: (result: ScriptResult) => void;
  onCancel: () => void;
};

export function InternetLinkScript({ onComplete, onCancel }: InternetLinkScriptProps) {
  const [page, setPage] = useState<1 | 2>(1);
  const [problem, setProblem] = useState('');
  const [impact, setImpact] = useState('');
  const [wantsOs, setWantsOs] = useState('');
  const [fcr, setFcr] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleNext(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!problem || !impact || !wantsOs || !fcr) {
      setError('Preencha todos os campos da página 1.');
      return;
    }
    if (!phone1.trim()) {
      setError('Telefone de contato 1 é obrigatório.');
      return;
    }
    setError(null);

    if (wantsOs === 'Não') {
      onComplete({ kind: 'os-not-opened' });
      return;
    }
    if (fcr === 'Sim') {
      onComplete({ kind: 'fcr-registered', fcrNumber: generateOsNumber() });
      return;
    }
    setPage(2);
  }

  function handleConclude(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customerName.trim()) {
      setError('Nome do cliente é obrigatório.');
      return;
    }
    if (!email1.trim()) {
      setError('E-mail para contato 1 é obrigatório.');
      return;
    }
    if (description.split('\n').length > 100) {
      setError('Descrição não pode ter mais de 100 linhas.');
      return;
    }
    setError(null);
    onComplete({ kind: 'os-opened', osNumber: generateOsNumber(), observation: description });
  }

  if (page === 1) {
    return (
      <form onSubmit={handleNext} className="space-y-3">
        <p className="text-xs text-zinc-500">Página 1 de 2</p>
        <FormSelect label="Problema" value={problem} options={PROBLEM_OPTIONS} onChange={setProblem} />
        <FormSelect label="Impacto" value={impact} options={IMPACT_OPTIONS} onChange={setImpact} />
        <FormSelect
          label="Deseja realmente abrir uma ordem de serviço?"
          value={wantsOs}
          options={['Sim', 'Não']}
          onChange={setWantsOs}
        />
        <FormSelect label="FCR?" value={fcr} options={['Sim', 'Não']} onChange={setFcr} />
        <FormField label="Telefone de contato 1" value={phone1} onChange={setPhone1} />
        <FormField label="Telefone de contato 2 (opcional)" value={phone2} onChange={setPhone2} />

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

  return (
    <form onSubmit={handleConclude} className="space-y-3">
      <p className="text-xs text-zinc-500">Página 2 de 2</p>
      <FormField label="Nome do cliente" value={customerName} onChange={setCustomerName} />
      <FormField label="E-mail para contato 1" value={email1} onChange={setEmail1} />
      <FormField label="E-mail para contato 2 (opcional)" value={email2} onChange={setEmail2} />
      <FormTextarea label="Descrição" value={description} onChange={setDescription} rows={5} />

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
