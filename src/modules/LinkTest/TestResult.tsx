import { useMemo, useState } from 'react';
import type { Contract } from '../../types/contract';
import type { SatSection, SatStep } from '../../types/sat';
import { runSatTest } from '../../utils/satTest';
import { SatLogModal } from './SatLogModal';

type TestResultProps = {
  contract: Contract;
};

type OpenLog = {
  step: SatStep;
  deviceName: string;
};

export function TestResult({ contract }: TestResultProps) {
  const run = useMemo(() => runSatTest(contract), [contract]);
  const [openLog, setOpenLog] = useState<OpenLog | null>(null);

  return (
    <div className="space-y-4">
      <ResultCard
        hasFailure={run.hasFailure}
        failureMessage={run.failureMessage}
        contract={contract}
      />

      {run.sections.map((section) => (
        <SectionTable
          key={section.device}
          section={section}
          onOpenLog={(step) => setOpenLog({ step, deviceName: section.deviceName })}
        />
      ))}

      {openLog && (
        <SatLogModal
          step={openLog.step}
          deviceName={openLog.deviceName}
          onClose={() => setOpenLog(null)}
        />
      )}
    </div>
  );
}

type ResultCardProps = {
  hasFailure: boolean;
  failureMessage: string | null;
  contract: Contract;
};

function ResultCard({ hasFailure, failureMessage, contract }: ResultCardProps) {
  const tone = hasFailure
    ? 'border-red-200 bg-red-50'
    : 'border-emerald-200 bg-emerald-50';
  const dot = hasFailure ? 'bg-red-500' : 'bg-emerald-500';
  const titleColor = hasFailure ? 'text-red-800' : 'text-emerald-800';
  const message = hasFailure
    ? failureMessage
    : 'Não foram identificadas falhas no circuito';

  return (
    <div className={`rounded-xl border p-5 animate-fade-in ${tone}`}>
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${dot}`}
        >
          {hasFailure ? '✕' : '✓'}
        </span>
        <div>
          <p className={`text-sm font-semibold ${titleColor}`}>{message}</p>
          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-zinc-600">
            <span>
              Circuito <span className="font-mono text-zinc-800">{contract.circuit}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Contrato <span className="font-mono text-zinc-800">{contract.contractNumber}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{contract.productName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type SectionTableProps = {
  section: SatSection;
  onOpenLog: (step: SatStep) => void;
};

function SectionTable({ section, onOpenLog }: SectionTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white animate-fade-in">
      <div className="border-b border-zinc-200 px-6 py-4">
        <h3 className="text-sm font-semibold text-zinc-900">{section.title}</h3>
        <p className="mt-0.5 font-mono text-xs text-zinc-500">{section.deviceName}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 w-10">#</th>
              <th className="px-4 py-3 w-16 text-center">Status</th>
              <th className="px-4 py-3">Procedimento</th>
              <th className="px-4 py-3">Resultado</th>
              <th className="px-4 py-3 w-16 text-center">Log</th>
            </tr>
          </thead>
          <tbody>
            {section.steps.map((step, index) => (
              <tr
                key={step.procedure}
                className="border-b border-zinc-100 odd:bg-white even:bg-zinc-50/50 last:border-0"
              >
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">{index + 1}</td>
                <td className="px-4 py-3 text-center">
                  <StatusIcon status={step.status} />
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900">{step.procedure}</td>
                <td className="px-4 py-3 text-zinc-600">{step.result || '—'}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => onOpenLog(step)}
                    aria-label={`Abrir log de ${step.procedure}`}
                    className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white p-1.5 text-indigo-600 transition-colors hover:bg-indigo-50"
                  >
                    <LogIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: SatStep['status'] }) {
  if (status === 'pass') {
    return (
      <span
        aria-label="Aprovado"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white"
      >
        ✓
      </span>
    );
  }
  if (status === 'fail') {
    return (
      <span
        aria-label="Falhou"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
      >
        ✕
      </span>
    );
  }
  return (
    <span
      aria-label="Não executado"
      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-300 text-xs font-bold text-white"
    >
      –
    </span>
  );
}

function LogIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 9h10M7 13h10M7 17h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
