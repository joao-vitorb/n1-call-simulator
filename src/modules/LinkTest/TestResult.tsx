import { useState } from 'react';
import type { Contract, SatChecklistItem } from '../../types/contract';
import { ChecklistDetailModal } from './ChecklistDetailModal';

type TestResultProps = {
  contract: Contract;
};

export function TestResult({ contract }: TestResultProps) {
  const [openItem, setOpenItem] = useState<SatChecklistItem | null>(null);
  const profile = contract.satTestProfile;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white animate-fade-in">
        <div className="border-b border-zinc-200 px-6 py-4">
          <h3 className="text-sm font-semibold text-zinc-900">Resultado do teste</h3>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-zinc-800">{profile.satMessage}</p>
          <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-xs text-zinc-500">
            <span>
              Circuito <span className="font-mono text-zinc-700">{contract.circuit}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Contrato <span className="font-mono text-zinc-700">{contract.contractNumber}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{contract.productName}</span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white animate-fade-in">
        <div className="border-b border-zinc-200 px-6 py-4">
          <h3 className="text-sm font-semibold text-zinc-900">Checklist</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Subtítulo</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {profile.checklist.map((item) => (
                <tr
                  key={item.title}
                  className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50"
                >
                  <td className="px-4 py-3 font-medium text-zinc-900">{item.title}</td>
                  <td className="px-4 py-3 text-zinc-600">{item.subtitle}</td>
                  <td className="px-4 py-3">
                    <StatusPill passed={item.passed} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setOpenItem(item)}
                      aria-label={`Abrir detalhes de ${item.title}`}
                      className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                    >
                      Abrir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {openItem && <ChecklistDetailModal item={openItem} onClose={() => setOpenItem(null)} />}
    </div>
  );
}

type StatusPillProps = {
  passed: boolean;
};

function StatusPill({ passed }: StatusPillProps) {
  if (passed) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Ok
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Falha
    </span>
  );
}
