import { useState, type FormEvent } from 'react';
import { generateOsNumber } from '../../../utils/osGenerator';
import { FormActions, FormError, FormField, FormSelect, FormTextarea } from './FormControls';
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
    onComplete({ kind: 'os-opened', osNumber: generateOsNumber(), observation: description });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormSelect label="Problema" value={problem} options={PROBLEM_OPTIONS} onChange={setProblem} />
      <FormSelect label="Impacto" value={impact} options={IMPACT_OPTIONS} onChange={setImpact} />
      <FormField label="Nome do cliente" value={customerName} onChange={setCustomerName} />
      <FormField label="Telefone para contato" value={phone} onChange={setPhone} mono />

      <div>
        <p className="mb-1.5 text-xs font-medium text-zinc-500">E-mail (até 5)</p>
        <div className="space-y-2">
          {emails.map((email, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={email}
                onChange={(event) => updateEmail(index, event.target.value)}
                placeholder={index === 0 ? 'Obrigatório' : 'Opcional'}
                className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              {emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmail(index)}
                  className="rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
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
              className="text-xs font-medium text-indigo-700 hover:text-indigo-800 hover:underline"
            >
              + Adicionar e-mail
            </button>
          )}
        </div>
      </div>

      <FormTextarea label="Descrição" value={description} onChange={setDescription} rows={5} />

      {error && <FormError>{error}</FormError>}

      <FormActions primaryLabel="Concluir" secondaryLabel="Cancelar" onSecondary={onCancel} />
    </form>
  );
}
