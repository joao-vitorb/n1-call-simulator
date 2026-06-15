import { useState, type FormEvent } from 'react';

export type ReexecuteInput = {
  name: string;
  phone: string;
  observation: string;
};

type ReexecuteModalProps = {
  orderNumber: string;
  onConfirm: (input: ReexecuteInput) => void;
  onClose: () => void;
};

export function ReexecuteModal({ orderNumber, onConfirm, onClose }: ReexecuteModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [observation, setObservation] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !phone.trim() || !observation.trim()) {
      setError('Preencha nome, telefone e observação para reexecutar.');
      return;
    }
    setError(null);
    onConfirm({ name: name.trim(), phone: phone.trim(), observation: observation.trim() });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-xl animate-scale-in"
      >
        <div className="border-b border-zinc-200 px-6 py-4">
          <h3 className="text-base font-semibold text-zinc-900">Reexecutar chamado</h3>
          <p className="mt-0.5 font-mono text-xs text-zinc-500">{orderNumber}</p>
        </div>

        <div className="space-y-4 px-6 py-5">
          <Field label="Nome do cliente" value={name} onChange={setName} />
          <Field label="Telefone" value={phone} onChange={setPhone} mono />
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-500">Observação</span>
            <textarea
              value={observation}
              onChange={(event) => setObservation(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Reexecutar
          </button>
        </div>
      </form>
    </div>
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
        className={`w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
          mono ? 'font-mono' : ''
        }`}
      />
    </label>
  );
}
