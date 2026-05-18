import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useCreatedOrders } from '../../../contexts/CreatedOrdersContext';
import { useTrainingSession } from '../../../contexts/TrainingSessionContext';
import { buildServiceOrder } from '../../../utils/serviceOrders';
import type { Company } from '../../../types/company';
import type { Contract, ProductType } from '../../../types/contract';
import type { ServiceOrderType } from '../../../types/serviceOrder';
import { InternetLinkScript } from './InternetLinkScript';
import { BandaLargaScript } from './BandaLargaScript';
import { VozTotalScript } from './VozTotalScript';
import { RfoForm } from './RfoForm';
import { VisitaTecnicaForm } from './VisitaTecnicaForm';
import { ProgramacaoServicosForm } from './ProgramacaoServicosForm';
import type { ScriptResult } from './types';

export type TechFormKind = 'script-integrado' | 'rfo' | 'visita-tecnica' | 'programacao-servicos';

const TITLES: Record<TechFormKind, string> = {
  'script-integrado': 'Script integrado',
  rfo: 'RFO',
  'visita-tecnica': 'Visita técnica',
  'programacao-servicos': 'Programação de serviços',
};

const KIND_TO_OS_TYPE: Record<TechFormKind, ServiceOrderType> = {
  'script-integrado': 'Incidente',
  rfo: 'RFO',
  'visita-tecnica': 'Visita técnica',
  'programacao-servicos': 'Programação de serviços',
};

type TechFormModalProps = {
  kind: TechFormKind;
  contract: Contract;
  company: Company;
  onClose: () => void;
};

export function TechFormModal({ kind, contract, company, onClose }: TechFormModalProps) {
  const { currentUser } = useAuth();
  const { registerOrder } = useCreatedOrders();
  const { activeCall } = useTrainingSession();
  const [result, setResult] = useState<ScriptResult | null>(null);

  function handleComplete(scriptResult: ScriptResult) {
    if (scriptResult.kind === 'os-opened') {
      const order = buildServiceOrder({
        type: KIND_TO_OS_TYPE[kind],
        company,
        contract,
        osNumber: scriptResult.osNumber,
        protocol: activeCall?.formState.protocol ?? '',
        createdBy: currentUser?.username ?? 'desconhecido',
        observation: scriptResult.observation,
      });
      registerOrder(order);
    }
    setResult(scriptResult);
  }

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
            {TITLES[kind]} · {contract.productType}
          </p>
          <p className="mb-4 text-sm text-zinc-600">
            Contrato {contract.contractNumber} · Circuito {contract.circuit}
          </p>

          {result ? (
            <ResultPanel result={result} onClose={onClose} />
          ) : (
            <FormByKind
              kind={kind}
              productType={contract.productType}
              onComplete={handleComplete}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

type FormByKindProps = {
  kind: TechFormKind;
  productType: ProductType;
  onComplete: (result: ScriptResult) => void;
  onCancel: () => void;
};

function FormByKind({ kind, productType, onComplete, onCancel }: FormByKindProps) {
  if (kind === 'script-integrado') {
    if (productType === 'Internet Link') {
      return <InternetLinkScript onComplete={onComplete} onCancel={onCancel} />;
    }
    if (productType === 'Banda Larga') {
      return <BandaLargaScript onComplete={onComplete} onCancel={onCancel} />;
    }
    return <VozTotalScript onComplete={onComplete} onCancel={onCancel} />;
  }
  if (kind === 'rfo') {
    return <RfoForm onComplete={onComplete} onCancel={onCancel} />;
  }
  if (kind === 'visita-tecnica') {
    return <VisitaTecnicaForm onComplete={onComplete} onCancel={onCancel} />;
  }
  return <ProgramacaoServicosForm onComplete={onComplete} onCancel={onCancel} />;
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
        <p className="mt-2 text-xs text-emerald-700">
          A OS já está disponível no módulo Service Orders.
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
