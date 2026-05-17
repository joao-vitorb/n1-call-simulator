import { useState } from 'react';
import type { Contract } from '../../types/contract';
import { findContractByCircuit } from '../../utils/circuits';
import { CircuitSearch } from './CircuitSearch';
import { ProgressBar } from './ProgressBar';
import { TestResult } from './TestResult';

type Phase = 'idle' | 'loading' | 'result' | 'not-available';

export function LinkTest() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [contract, setContract] = useState<Contract | null>(null);

  function handleTest(circuitValue: string) {
    const found = findContractByCircuit(circuitValue);
    if (!found || found.productType !== 'Internet Link' || !found.satTestProfile.availableInSat) {
      setContract(null);
      setPhase('not-available');
      return;
    }
    setContract(found);
    setPhase('loading');
  }

  function handleProgressComplete() {
    setPhase('result');
  }

  return (
    <section className="flex flex-1 flex-col gap-6 overflow-y-auto bg-zinc-50 p-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <CircuitSearch onSearch={handleTest} disabled={phase === 'loading'} />
      </div>

      {phase === 'loading' && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <ProgressBar durationMs={10000} onComplete={handleProgressComplete} />
        </div>
      )}

      {phase === 'not-available' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-medium text-amber-800">Circuito não informado</p>
          <p className="mt-1 text-xs text-amber-700">
            O SAT aceita apenas circuitos de Internet Link existentes na base.
          </p>
        </div>
      )}

      {phase === 'result' && contract && <TestResult contract={contract} />}
    </section>
  );
}
