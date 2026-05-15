import { useEffect, useState } from 'react';
import { generateProtocol } from '../../utils/protocolGenerator';
import type { Protocol } from '../../types/protocol';

const PREFERENCE_OPTIONS = ['Email', 'Telefone', 'SMS', 'Email/Telefone', 'Prefere não ser contatado'];
const DELIVERY_OPTIONS = ['Telefone', 'SMS', 'Email/Telefone', 'Prefere não receber'];

type ProtocolPanelProps = {
  contextProtocol: Protocol | null;
};

export function ProtocolPanel({ contextProtocol }: ProtocolPanelProps) {
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
    setProtocolNumber(generateProtocol());
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-sm">
      <p className="mb-3 font-medium text-zinc-700">Dados do protocolo</p>

      <div className="mb-2 grid grid-cols-3 gap-2">
        <SmallField label="DDD" value={ddd1} onChange={setDdd1} />
        <div className="col-span-2">
          <SmallField label="Telefone 1" value={phone1} onChange={setPhone1} />
        </div>
      </div>

      <div className="mb-2 grid grid-cols-3 gap-2">
        <SmallField label="DDD" value={ddd2} onChange={setDdd2} />
        <div className="col-span-2">
          <SmallField label="Telefone 2" value={phone2} onChange={setPhone2} />
        </div>
      </div>

      <div className="mb-2">
        <SmallField label="Nome do cliente" value={customerName} onChange={setCustomerName} />
      </div>
      <div className="mb-2">
        <SmallField label="Observação" value={observation} onChange={setObservation} />
      </div>
      <div className="mb-2">
        <SmallField label="E-mail" value={email} onChange={setEmail} />
      </div>
      <div className="mb-2">
        <SmallSelect
          label="Preferência de contato"
          value={contactPreference}
          options={PREFERENCE_OPTIONS}
          onChange={setContactPreference}
        />
      </div>
      <div className="mb-2">
        <SmallSelect
          label="Meio de envio"
          value={deliveryMethod}
          options={DELIVERY_OPTIONS}
          onChange={setDeliveryMethod}
        />
      </div>
      <div className="mb-3">
        <SmallField label="Protocolo gerado" value={protocolNumber} readOnly />
      </div>

      {error && <p className="mb-2 text-xs text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleGenerate}
        className="w-full rounded-md bg-zinc-900 px-3 py-2 font-medium text-white transition-colors hover:bg-zinc-800"
      >
        Gerar protocolo
      </button>
    </section>
  );
}

type SmallFieldProps = {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
};

function SmallField({ label, value, onChange, readOnly }: SmallFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-zinc-500">{label}</span>
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-zinc-900 outline-none focus:border-zinc-500 read-only:bg-zinc-50 read-only:text-zinc-500"
      />
    </label>
  );
}

type SmallSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function SmallSelect({ label, value, options, onChange }: SmallSelectProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-zinc-900 outline-none focus:border-zinc-500"
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
