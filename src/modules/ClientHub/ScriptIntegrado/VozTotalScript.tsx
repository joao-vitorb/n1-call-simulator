import { useState, type FormEvent } from 'react';
import { generateOsNumber } from '../../../utils/osGenerator';
import { FormField, FormSelect, FormTextarea } from './FormControls';
import type { ScriptResult } from './types';

const PROBLEM_OPTIONS = [
  'Interrompido',
  'Intermitente',
  'Não recebe ligações',
  'Não origina ligações',
  'Performance',
  'Ecos ou picotes',
];
const IMPACT_OPTIONS = ['Baixo', 'Médio', 'Alto', 'Crítico'];

type VozTotalScriptProps = {
  onComplete: (result: ScriptResult) => void;
  onCancel: () => void;
};

export function VozTotalScript({ onComplete, onCancel }: VozTotalScriptProps) {
  const [problem, setProblem] = useState('');
  const [impact, setImpact] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [emails, setEmails] = useState(['']);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  function updateEmail(index: number, value: string) {
    setEmails((current) => current.map((email, i) => (i === index ? value : email)));
  }

  function addEmail() {
    setEmails((current) => (current.length >= 5 ? current : [...current, '']));
  }

  function removeEmail(index: number) {
    setEmails((current) => current.filter((_, i) => i !== index));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!problem || !impact || !customerName.trim() || !phone.trim() || !emails[0].trim()) {
      setError('Preencha os campos obrigatórios.');
      return;
    }
    if (description.split('\n').length > 100) {
      setError('Descrição não pode ter mais de 100 linhas.');
      return;
    }
    setError(null);
    onComplete({ kind: 'os-opened', osNumber: generateOsNumber() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-xs text-zinc-500">Página única</p>
      <FormSelect label="Problema" value={problem} options={PROBLEM_OPTIONS} onChange={setProblem} />
      <FormSelect label="Impacto" value={impact} options={IMPACT_OPTIONS} onChange={setImpact} />
      <FormField label="Nome do cliente" value={customerName} onChange={setCustomerName} />
      <FormField label="Telefone para contato" value={phone} onChange={setPhone} />

      <div>
        <p className="mb-1 text-sm font-medium text-zinc-700">E-mail (até 5)</p>
        <div className="space-y-2">
          {emails.map((email, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={email}
                onChange={(event) => updateEmail(index, event.target.value)}
                placeholder={index === 0 ? 'Obrigatório' : 'Opcional'}
                className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
              />
              {emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmail(index)}
                  className="rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-700 hover:bg-zinc-50"
                >
                  Remover
                </button>
              )}
            </div>
          ))}
          {emails.length < 5 && (
            <button
              type="button"
              onClick={addEmail}
              className="text-xs font-medium text-emerald-700 hover:underline"
            >
              + Adicionar e-mail
            </button>
          )}
        </div>
      </div>

      <FormTextarea label="Descrição" value={description} onChange={setDescription} rows={5} />

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
