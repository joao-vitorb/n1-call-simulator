import { useEffect, useState } from 'react';

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

export function CallCategorization() {
  const [level1, setLevel1] = useState('');
  const [level2, setLevel2] = useState('');
  const [level3, setLevel3] = useState('');
  const [protocol, setProtocol] = useState('');
  const [legalName, setLegalName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [segment, setSegment] = useState('');
  const [circuit, setCircuit] = useState('');
  const [product, setProduct] = useState('');
  const [locality, setLocality] = useState('');
  const [hasCallback, setHasCallback] = useState('');
  const [callbackProtocol, setCallbackProtocol] = useState('');
  const [observation, setObservation] = useState('');
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const level3Options = level1 && level2 ? LEVEL_3_MAP[level1]?.[level2] ?? [] : [];

  useEffect(() => {
    if (!savedAt) return;
    const id = window.setTimeout(() => setSavedAt(null), 2500);
    return () => window.clearTimeout(id);
  }, [savedAt]);

  function handleSave() {
    setSavedAt(Date.now());
  }

  return (
    <section className="flex flex-1 flex-col overflow-y-auto bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-3">
        <p className="text-sm font-medium text-zinc-700">Categorização do atendimento</p>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-xs text-emerald-600">Atendimento salvo na sessão.</span>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Salvar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 border-b border-zinc-200 px-6 py-4">
        <Select
          label="Nível 1"
          value={level1}
          options={LEVEL_1_OPTIONS}
          onChange={(value) => {
            setLevel1(value);
            setLevel2('');
            setLevel3('');
          }}
        />
        <Select
          label="Nível 2"
          value={level2}
          options={LEVEL_2_OPTIONS}
          disabled={!level1}
          onChange={(value) => {
            setLevel2(value);
            setLevel3('');
          }}
        />
        <Select
          label="Nível 3"
          value={level3}
          options={level3Options}
          disabled={!level1 || !level2}
          onChange={setLevel3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 px-6 py-4">
        <Field label="Protocolo" value={protocol} onChange={setProtocol} />
        <Field label="Razão social" value={legalName} onChange={setLegalName} />
        <Field label="CNPJ" value={cnpj} onChange={setCnpj} />
        <Field label="Segmento" value={segment} onChange={setSegment} />
        <Field label="Circuito" value={circuit} onChange={setCircuit} />
        <Field label="Produto" value={product} onChange={setProduct} />
        <Field label="Localidade" value={locality} onChange={setLocality} />
        <Select
          label="Callback?"
          value={hasCallback}
          options={['Sim', 'Não']}
          onChange={setHasCallback}
        />
        <Field
          label="Protocolo do callback"
          value={callbackProtocol}
          onChange={setCallbackProtocol}
        />
        <Field label="Observação" value={observation} onChange={setObservation} />
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
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-zinc-700">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 disabled:bg-zinc-50 disabled:text-zinc-400"
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
};

function Field({ label, value, onChange }: FieldProps) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-zinc-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500"
      />
    </label>
  );
}
