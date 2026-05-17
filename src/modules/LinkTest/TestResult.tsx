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
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Resultado do teste</p>
        <p className="mt-1 text-sm text-zinc-800">{profile.satMessage}</p>
        <p className="mt-3 text-xs text-zinc-500">
          Circuito {contract.circuit} · Contrato {contract.contractNumber} · {contract.productName}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-2">Título</th>
              <th className="px-4 py-2">Subtítulo</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {profile.checklist.map((item) => (
              <tr key={item.title} className="border-b border-zinc-100 last:border-0">
                <td className="px-4 py-3 font-medium text-zinc-900">{item.title}</td>
                <td className="px-4 py-3 text-zinc-600">{item.subtitle}</td>
                <td className="px-4 py-3">
                  {item.passed ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <span className="text-base leading-none">✓</span>
                      <span className="text-xs">Ok</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600">
                      <span className="text-base leading-none">✗</span>
                      <span className="text-xs">Falha</span>
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setOpenItem(item)}
                    aria-label={`Abrir detalhes de ${item.title}`}
                    className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
                  >
                    Abrir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openItem && <ChecklistDetailModal item={openItem} onClose={() => setOpenItem(null)} />}
    </div>
  );
}
