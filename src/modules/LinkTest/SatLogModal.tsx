import type { SatStep } from '../../types/sat';

type SatLogModalProps = {
  step: SatStep;
  deviceName: string;
  onClose: () => void;
};

const STATUS_LABEL: Record<SatStep['status'], string> = {
  pass: 'Aprovado',
  fail: 'Falhou',
  skipped: 'Não executado',
};

const STATUS_CLASS: Record<SatStep['status'], string> = {
  pass: 'bg-emerald-50 text-emerald-700',
  fail: 'bg-red-50 text-red-700',
  skipped: 'bg-zinc-100 text-zinc-600',
};

const DOT_CLASS: Record<SatStep['status'], string> = {
  pass: 'bg-emerald-500',
  fail: 'bg-red-500',
  skipped: 'bg-zinc-400',
};

export function SatLogModal({ step, deviceName, onClose }: SatLogModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white shadow-xl animate-scale-in"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Log de teste · {deviceName}
            </p>
            <h3 className="mt-1 text-base font-semibold text-zinc-900">{step.procedure}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[step.status]}`}
            >
              <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${DOT_CLASS[step.status]}`} />
              {STATUS_LABEL[step.status]}
            </span>
            {step.result && <span className="text-sm text-zinc-600">{step.result}</span>}
          </div>

          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
            <div className="flex items-center gap-1.5 border-b border-zinc-800 px-4 py-2">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-xs text-zinc-400">{deviceName} — PuTTY</span>
            </div>
            <pre className="max-h-80 overflow-auto px-4 py-3 font-mono text-xs leading-relaxed text-emerald-300 whitespace-pre-wrap">
              {step.log}
            </pre>
          </div>
        </div>

        <div className="border-t border-zinc-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
