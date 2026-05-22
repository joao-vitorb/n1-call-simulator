import { useEffect, useState } from 'react';
import { generateProtocol } from '../../utils/protocolGenerator';
import { useTrainingSession } from '../../contexts/TrainingSessionContext';
import type { Protocol } from '../../types/protocol';

const PREFERENCE_OPTIONS = ['Email', 'Telefone', 'SMS', 'Email/Telefone', 'Prefere não ser contatado'];
const DELIVERY_OPTIONS = ['Telefone', 'SMS', 'Email/Telefone', 'Prefere não receber'];

type ProtocolPanelProps = {
  contextProtocol: Protocol | null;
};

export function ProtocolPanel({ contextProtocol }: ProtocolPanelProps) {
  const { activeCall, updateCallForm } = useTrainingSession();
  const [ddd1, setDdd1] = useState('');
  const [phone1, setPhone1] = useState('');
  const [ddd2, setDdd2] = useState('');
  const [phone2, setPhone2] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [observation, setObservation] = useState('');
  const [email, setEmail] = useState('');
  const [contactPreference, setContactPreference] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [protocolNumber, setProtocolNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contextProtocol) {
      setDdd1(contextProtocol.phone1.ddd);
      setPhone1(contextProtocol.phone1.number);
      setDdd2(contextProtocol.phone2?.ddd ?? '');
      setPhone2(contextProtocol.phone2?.number ?? '');
      setCustomerName(contextProtocol.customerName);
      setObservation(contextProtocol.observation);
      setEmail(contextProtocol.email);
      setContactPreference(contextProtocol.contactPreference);
      setDeliveryMethod(contextProtocol.deliveryMethod);
      setProtocolNumber(contextProtocol.protocol);
    } else {
      setDdd1('');
      setPhone1('');
      setDdd2('');
      setPhone2('');
      setCustomerName('');
      setObservation('');
      setEmail('');
      setContactPreference('');
      setDeliveryMethod('');
      setProtocolNumber('');
    }
    setError(null);
  }, [contextProtocol]);

  function handleGenerate() {
    if (!phone1.trim()) {
      setError('Telefone 1 é obrigatório.');
      return;
    }
    if (!customerName.trim()) {
      setError('Nome do cliente é obrigatório.');
      return;
    }
    setError(null);
    const newProtocol = generateProtocol();
    setProtocolNumber(newProtocol);
    if (activeCall && !activeCall.saved) {
      updateCallForm(activeCall.id, { protocol: newProtocol });
    }
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-zinc-900">Dados do protocolo</h3>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Field label="DDD" value={ddd1} onChange={setDdd1} mono />
        <div className="col-span-2">
          <Field label="Telefone 1" value={phone1} onChange={setPhone1} mono />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Field label="DDD" value={ddd2} onChange={setDdd2} mono />
        <div className="col-span-2">
          <Field label="Telefone 2" value={phone2} onChange={setPhone2} mono />
        </div>
      </div>
      <div className="mt-3 space-y-3">
        <Field label="Nome do cliente" value={customerName} onChange={setCustomerName} />
        <Field label="Observação" value={observation} onChange={setObservation} />
        <Field label="E-mail" value={email} onChange={setEmail} />
        <Select
          label="Preferência de contato"
          value={contactPreference}
          options={PREFERENCE_OPTIONS}
          onChange={setContactPreference}
        />
        <Select
          label="Meio de envio"
          value={deliveryMethod}
          options={DELIVERY_OPTIONS}
          onChange={setDeliveryMethod}
        />
        <div>
          <p className="mb-1 text-xs font-medium text-zinc-500">Protocolo gerado</p>
          {protocolNumber ? (
            <p className="font-mono text-sm text-zinc-900">{protocolNumber}</p>
          ) : (
            <p className="text-sm text-zinc-400">—</p>
          )}
        </div>
      </div>

      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleGenerate}
        className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
      >
        Gerar protocolo
      </button>
    </section>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  mono?: boolean;
};

function Field({ label, value, onChange, mono }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
          mono ? 'font-mono' : ''
        }`}
      />
    </label>
  );
}

type SelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
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
