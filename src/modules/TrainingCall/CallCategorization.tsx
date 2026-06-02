import { useEffect, useState } from 'react';
import type { CallEntry, CallFormState } from '../../types/trainingCall';

const LEVEL_1_OPTIONS = ['Técnico Dados', 'Técnico Voz'];
const LEVEL_2_OPTIONS = ['Informação', 'Reclamação', 'Solicitação'];

const LEVEL_3_MAP: Record<string, Record<string, string[]>> = {
  'Técnico Dados': {
    Informação: ['Dados do circuito', 'Status de chamado', 'Status de massiva'],
    Reclamação: ['Inoperante', 'Intermitente', 'Lentidão', 'Bloqueio de site', 'Massiva', 'FCR'],
    Solicitação: ['Programação de serviços', 'Visita técnica', 'RFO'],
  },
  'Técnico Voz': {
    Informação: ['Dados do circuito', 'Status de chamado', 'Status de massiva'],
    Reclamação: [
      'Interrompido',
      'Intermitente',
      'Não recebe chamadas',
      'Não origina chamadas',
      'Eco ou picotes',
      'Performance',
      'Massiva',
    ],
    Solicitação: ['Programação de serviços', 'Visita técnica', 'RFO'],
  },
};

type CallCategorizationProps = {
  call: CallEntry;
  onUpdate: (updates: Partial<CallFormState>) => void;
  onSave: () => void;
};

export function CallCategorization({ call, onUpdate, onSave }: CallCategorizationProps) {
  const [savedFlashAt, setSavedFlashAt] = useState<number | null>(null);
  const readOnly = call.saved;
  const form = call.formState;
  const level3Options =
    form.level1 && form.level2 ? LEVEL_3_MAP[form.level1]?.[form.level2] ?? [] : [];

  useEffect(() => {
    if (!savedFlashAt) return;
    const id = window.setTimeout(() => setSavedFlashAt(null), 2500);
    return () => window.clearTimeout(id);
  }, [savedFlashAt]);

  function handleSave() {
    if (readOnly) return;
    onSave();
    setSavedFlashAt(Date.now());
  }

  function updateField<K extends keyof CallFormState>(key: K, value: CallFormState[K]) {
    onUpdate({ [key]: value } as Partial<CallFormState>);
  }

  return (
    <section className="shrink-0 rounded-xl border border-zinc-200 bg-white animate-fade-in">
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Categorização do atendimento</h3>
          {readOnly && (
            <p className="mt-0.5 text-xs text-zinc-500">Atendimento salvo. Edição bloqueada.</p>
          )}
          {!readOnly && call.finishedAt && (
            <p className="mt-0.5 text-xs text-amber-600">
              Atendimento pendente. Você ainda pode editar e salvar.
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {savedFlashAt && (
            <span className="text-xs font-medium text-emerald-600">Atendimento salvo.</span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={readOnly}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Salvar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 border-b border-zinc-200 px-6 py-4">
        <Select
          label="Nível 1"
          value={form.level1}
          options={LEVEL_1_OPTIONS}
          disabled={readOnly}
          onChange={(value) => onUpdate({ level1: value, level2: '', level3: '' })}
        />
        <Select
          label="Nível 2"
          value={form.level2}
          options={LEVEL_2_OPTIONS}
          disabled={readOnly || !form.level1}
          onChange={(value) => onUpdate({ level2: value, level3: '' })}
        />
        <Select
          label="Nível 3"
          value={form.level3}
          options={level3Options}
          disabled={readOnly || !form.level1 || !form.level2}
          onChange={(value) => onUpdate({ level3: value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 px-6 py-4">
        <Field label="Protocolo" value={form.protocol} onChange={(v) => updateField('protocol', v)} disabled={readOnly} mono />
        <Field label="Razão social" value={form.legalName} onChange={(v) => updateField('legalName', v)} disabled={readOnly} />
        <Field label="CNPJ" value={form.cnpj} onChange={(v) => updateField('cnpj', v)} disabled={readOnly} mono />
        <Field label="Segmento" value={form.segment} onChange={(v) => updateField('segment', v)} disabled={readOnly} />
        <Field label="Circuito" value={form.circuit} onChange={(v) => updateField('circuit', v)} disabled={readOnly} mono />
        <Field label="Produto" value={form.product} onChange={(v) => updateField('product', v)} disabled={readOnly} />
        <Field label="Localidade" value={form.locality} onChange={(v) => updateField('locality', v)} disabled={readOnly} />
        <Select
          label="Callback?"
          value={form.hasCallback}
          options={['Sim', 'Não']}
          disabled={readOnly}
          onChange={(v) => updateField('hasCallback', v)}
        />
        <Field label="Protocolo do callback" value={form.callbackProtocol} onChange={(v) => updateField('callbackProtocol', v)} disabled={readOnly} mono />
        <Field label="Observação" value={form.observation} onChange={(v) => updateField('observation', v)} disabled={readOnly} />
      </div>
    </section>
  );
}

type SelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

function Select({ label, value, options, onChange, disabled }: SelectProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-500">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500"
      >
        <option value="">—</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  mono?: boolean;
};

function Field({ label, value, onChange, disabled, mono }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-500">{label}</span>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500 ${
          mono ? 'font-mono' : ''
        }`}
      />
    </label>
  );
}
