import { useState } from 'react';
import type { Contract, ProductType } from '../../../types/contract';
import { InternetLinkScript } from './InternetLinkScript';
import { BandaLargaScript } from './BandaLargaScript';
import { VozTotalScript } from './VozTotalScript';
import type { ScriptResult } from './types';

type ScriptIntegradoModalProps = {
  contract: Contract;
  onClose: () => void;
};

export function ScriptIntegradoModal({ contract, onClose }: ScriptIntegradoModalProps) {
  const [result, setResult] = useState<ScriptResult | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 rounded-md p-1 text-zinc-500 hover:bg-zinc-100"
        >
          ✕
        </button>

        <div className="p-6">
          <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
            Script integrado · {contract.productType}
          </p>
          <p className="mb-4 text-sm text-zinc-600">
            Contrato {contract.contractNumber} · Circuito {contract.circuit}
          </p>

          {result ? (
            <ResultPanel result={result} onClose={onClose} />
          ) : (
            <ScriptByProduct
              productType={contract.productType}
              onComplete={setResult}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

type ScriptByProductProps = {
  productType: ProductType;
  onComplete: (result: ScriptResult) => void;
  onCancel: () => void;
};

function ScriptByProduct({ productType, onComplete, onCancel }: ScriptByProductProps) {
  if (productType === 'Internet Link') {
    return <InternetLinkScript onComplete={onComplete} onCancel={onCancel} />;
  }
  if (productType === 'Banda Larga') {
    return <BandaLargaScript onComplete={onComplete} onCancel={onCancel} />;
  }
  return <VozTotalScript onComplete={onComplete} onCancel={onCancel} />;
}

type ResultPanelProps = {
  result: ScriptResult;
  onClose: () => void;
};

function ResultPanel({ result, onClose }: ResultPanelProps) {
  if (result.kind === 'os-opened') {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-sm font-medium text-emerald-800">Finalizado com abertura de OS</p>
        <p className="mt-2 text-sm text-emerald-700">
          OS gerada: <span className="font-mono font-medium">{result.osNumber}</span>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Fechar
        </button>
      </div>
    );
  }
  if (result.kind === 'fcr-registered') {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
        <p className="text-sm font-medium text-blue-800">FCR registrado com sucesso</p>
        <p className="mt-2 text-sm text-blue-700">
          Número FCR: <span className="font-mono font-medium">{result.fcrNumber}</span>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Fechar
        </button>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
      <p className="text-sm font-medium text-zinc-800">Finalizado sem abertura de OS</p>
      <button
        type="button"
        onClick={onClose}
        className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Fechar
      </button>
    </div>
  );
}
