import type { SatChecklistItem } from '../../types/contract';

type ChecklistDetailModalProps = {
  item: SatChecklistItem;
  onClose: () => void;
};

export function ChecklistDetailModal({ item, onClose }: ChecklistDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl animate-scale-in"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
        >
          ✕
        </button>

        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Detalhes</p>
        <h3 className="mt-1 text-lg font-semibold text-zinc-900">{item.title}</h3>
        <p className="mt-1 text-sm text-zinc-500">{item.subtitle}</p>

        <div
          className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            item.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${item.passed ? 'bg-emerald-500' : 'bg-red-500'}`}
          />
          {item.passed ? 'Aprovado' : 'Falhou'}
        </div>

        <p className="mt-4 text-sm text-zinc-700">{item.modalDetails}</p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
