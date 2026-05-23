import { useEffect, useState } from 'react';
import { generateProtocol } from '../../utils/protocolGenerator';
import { useAuth } from '../../contexts/AuthContext';
import { useTrainingSession } from '../../contexts/TrainingSessionContext';
import { useClientHubData } from '../../contexts/ClientHubDataContext';
import type { Company } from '../../types/company';
import type { ProtocolContext } from '../../utils/protocols';

const PREFERENCE_OPTIONS = ['Email', 'Telefone', 'SMS', 'Email/Telefone', 'Prefere não ser contatado'];
const DELIVERY_OPTIONS = ['Telefone', 'SMS', 'Email/Telefone', 'Prefere não receber'];

type ProtocolPanelProps = {
  company: Company;
  protocolContext: ProtocolContext | null;
  onProtocolGenerated: (protocolNumber: string) => void;
};

export function ProtocolPanel({ company, protocolContext, onProtocolGenerated }: ProtocolPanelProps) {
  const { currentUser } = useAuth();
  const { activeCall, updateCallForm } = useTrainingSession();
  const { registerProtocol } = useClientHubData();

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
  const [generatedBy, setGeneratedBy] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (protocolContext) {
      setDdd1(protocolContext.ddd1);
      setPhone1(protocolContext.phone1);
      setDdd2(protocolContext.ddd2);
      setPhone2(protocolContext.phone2);
      setCustomerName(protocolContext.customerName);
      setObservation(protocolContext.observation);
      setEmail(protocolContext.email);
      setContactPreference(protocolContext.contactPreference);
      setDeliveryMethod(protocolContext.deliveryMethod);
      setProtocolNumber(protocolContext.protocol);
      setGeneratedBy(protocolContext.generatedBy);
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
      setGeneratedBy('');
    }
    setError(null);
  }, [protocolContext]);

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
    const author = currentUser?.username ?? 'desconhecido';

    registerProtocol({
      protocol: newProtocol,
      companyId: company.id,
      generatedBy: author,
      generatedAt: new Date().toISOString(),
      customerName,
      ddd1,
      phone1,
      ddd2,
      phone2,
      email,
      contactPreference,
      deliveryMethod,
      observation,
    });

    setProtocolNumber(newProtocol);
    setGeneratedBy(author);

    if (activeCall && !activeCall.saved) {
      updateCallForm(activeCall.id, { protocol: newProtocol });
    }

    onProtocolGenerated(newProtocol);
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-zinc-900">Dados do protocolo</h3>

      <div className="grid grid-cols-3 gap-2">
        <PanelField label="DDD" value={ddd1} onChange={setDdd1} mono />
        <div className="col-span-2">
          <PanelField label="Telefone 1" value={phone1} onChange={setPhone1} mono />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <PanelField label="DDD" value={ddd2} onChange={setDdd2} mono />
        <div className="col-span-2">
          <PanelField label="Telefone 2" value={phone2} onChange={setPhone2} mono />
        </div>
      </div>
      <div className="mt-3 space-y-3">
        <PanelField label="Nome do cliente" value={customerName} onChange={setCustomerName} />
        <PanelField label="Observação" value={observation} onChange={setObservation} />
        <PanelField label="E-mail" value={email} onChange={setEmail} />
        <PanelSelect
          label="Preferência de contato"
          value={contactPreference}
          options={PREFERENCE_OPTIONS}
          onChange={setContactPreference}
        />
        <PanelSelect
          label="Meio de envio"
          value={deliveryMethod}
          options={DELIVERY_OPTIONS}
          onChange={setDeliveryMethod}
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="mb-1 text-xs font-medium text-zinc-500">Protocolo gerado</p>
            <p className="font-mono text-sm text-zinc-900">
              {protocolNumber || <span className="text-zinc-300">—</span>}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-zinc-500">Gerado por</p>
            <p className="text-sm text-zinc-900">
              {generatedBy || <span className="text-zinc-300">—</span>}
            </p>
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

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

type PanelFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  mono?: boolean;
};

function PanelField({ label, value, onChange, mono }: PanelFieldProps) {
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

type PanelSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function PanelSelect({ label, value, options, onChange }: PanelSelectProps) {
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
