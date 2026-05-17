import type { SatChecklistItem } from '../../types/contract';

type ChecklistDetailModalProps = {
  item: SatChecklistItem;
  onClose: () => void;
};

export function ChecklistDetailModal({ item, onClose }: ChecklistDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 rounded-md p-1 text-zinc-500 hover:bg-zinc-100"
        >
          ✕
        </button>
        <p className="text-xs uppercase tracking-wide text-zinc-500">Detalhes</p>
        <h3 className="mt-1 text-lg font-semibold text-zinc-900">{item.title}</h3>
        <p className="mt-1 text-sm text-zinc-500">{item.subtitle}</p>

        <div
          className={`mt-4 inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium ${
            item.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {item.passed ? '✓ Aprovado' : '✗ Falhou'}
        </div>

        <p className="mt-4 text-sm text-zinc-700">{item.modalDetails}</p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
