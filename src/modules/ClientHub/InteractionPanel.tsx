import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useClientHubData } from '../../contexts/ClientHubDataContext';
import type { Company } from '../../types/company';
import type { ProtocolContext } from '../../utils/protocols';

type InteractionPanelProps = {
  company: Company;
  protocolContext: ProtocolContext;
  onFinalize: () => void;
};

export function InteractionPanel({ company, protocolContext, onFinalize }: InteractionPanelProps) {
  const { currentUser } = useAuth();
  const { registerInteraction } = useClientHubData();
  const [summary, setSummary] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setSummary('');
    setError(null);
    setSavedFlash(false);
  }, [protocolContext.protocol]);

  useEffect(() => {
    if (!savedFlash) return;
    const id = window.setTimeout(() => setSavedFlash(false), 2500);
    return () => window.clearTimeout(id);
  }, [savedFlash]);

  function persist() {
    registerInteraction({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      protocol: protocolContext.protocol,
      companyId: company.id,
      summary: summary.trim(),
      contactName: protocolContext.customerName,
      ddd: protocolContext.ddd1,
      phone: protocolContext.phone1,
      createdBy: currentUser?.username ?? 'desconhecido',
      createdAt: new Date().toISOString(),
    });
  }

  function handleSave() {
    if (!summary.trim()) {
      setError('Descreva a interação antes de salvar.');
      return;
    }
    setError(null);
    persist();
    setSummary('');
    setSavedFlash(true);
  }

  function handleFinalize() {
    if (!summary.trim()) {
      setError('Descreva a interação antes de finalizar.');
      return;
    }
    setError(null);
    persist();
    onFinalize();
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900">Formulário da interação</h3>
        {savedFlash && <span className="text-xs font-medium text-emerald-600">Interação salva.</span>}
      </div>
      <p className="mb-3 text-xs text-zinc-500">
        Protocolo <span className="font-mono text-zinc-700">{protocolContext.protocol}</span>
      </p>
      <textarea
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
        rows={5}
        placeholder="Descreva o assunto do atendimento"
        className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleFinalize}
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Finalizar
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Salvar
        </button>
      </div>
    </section>
  );
}
