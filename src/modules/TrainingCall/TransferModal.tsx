import { useMemo, useState } from 'react';
import { SAC_ATTENDANTS, type SacAttendant } from '../../utils/sac';

type TransferModalProps = {
  reachedAttendant: SacAttendant | null;
  onClose: () => void;
  onConfirmed: (attendant: SacAttendant) => void;
};

export function TransferModal({ reachedAttendant, onClose, onConfirmed }: TransferModalProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SacAttendant | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return SAC_ATTENDANTS;
    return SAC_ATTENDANTS.filter(
      (attendant) =>
        attendant.name.toLowerCase().includes(term) || attendant.extension.includes(term),
    );
  }, [query]);

  function handleTransfer() {
    const attendant = SAC_ATTENDANTS.find((item) => item.extension === selected);
    if (!attendant) return;
    if (reachedAttendant && attendant.extension !== reachedAttendant.extension) {
      setError('O ramal selecionado não confere com a atendente que atendeu. Confirme o ramal com ela.');
      return;
    }
    setError(null);
    setSuccess(attendant);
  }

  if (success) {
    return (
      <Backdrop onClose={onClose}>
        <div className="px-6 py-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h3 className="mt-4 text-base font-semibold text-zinc-900">Ligação transferida</h3>
          <p className="mt-1 text-sm text-zinc-600">
            Cliente transferido para {success.name}{' '}
            <span className="font-mono">(ramal {success.extension})</span>.
          </p>
          <button
            type="button"
            onClick={() => onConfirmed(success)}
            className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Concluir
          </button>
        </div>
      </Backdrop>
    );
  }

  return (
    <Backdrop onClose={onClose}>
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
        <h3 className="text-base font-semibold text-zinc-900">Transferência</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
        >
          ✕
        </button>
      </div>

      <div className="px-6 py-5">
        <input
          type="text"
          value={query}
          autoFocus
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nome ou ramal…"
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />

        <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <li className="px-2 py-3 text-sm text-zinc-400">Nenhum atendente encontrado.</li>
          ) : (
            filtered.map((attendant) => {
              const active = selected === attendant.extension;
              return (
                <li key={attendant.extension}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(attendant.extension);
                      setError(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
                      active
                        ? 'border-indigo-300 bg-indigo-50'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50'
                    }`}
                  >
                    <span className="text-sm font-medium text-zinc-900">{attendant.name}</span>
                    <span className="font-mono text-xs text-zinc-500">ramal {attendant.extension}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
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
          type="button"
          onClick={handleTransfer}
          disabled={!selected}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Transferir
        </button>
      </div>
    </Backdrop>
  );
}

type BackdropProps = {
  onClose: () => void;
  children: React.ReactNode;
};

function Backdrop({ onClose, children }: BackdropProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-xl animate-scale-in"
      >
        {children}
      </div>
    </div>
  );
}
