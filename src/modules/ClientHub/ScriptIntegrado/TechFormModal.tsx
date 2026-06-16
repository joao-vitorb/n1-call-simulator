import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useCreatedOrders } from '../../../contexts/CreatedOrdersContext';
import { useTrainingSession } from '../../../contexts/TrainingSessionContext';
import { buildServiceOrder } from '../../../utils/serviceOrders';
import { getMassivaForCircuit } from '../../../utils/massiva';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-6 backdrop-blur-sm animate-fade-in">
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl animate-scale-in">
        <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">{TITLES[kind]}</h2>
            <p className="mt-1 text-xs text-zinc-500">
              {contract.productType} · Contrato{' '}
              <span className="font-mono">{contract.contractNumber}</span> · Circuito{' '}
              <span className="font-mono">{contract.circuit}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="block"
            >
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <div className="max-h-[calc(90vh-5rem)] overflow-y-auto px-6 py-6">
          {result ? (
            <ResultPanel result={result} onClose={onClose} />
          ) : (
            <FormByKind
              kind={kind}
              productType={contract.productType}
              massivaOs={getMassivaForCircuit(contract.circuit)?.osNumber ?? null}
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
  massivaOs: string | null;
  onComplete: (result: ScriptResult) => void;
  onCancel: () => void;
};

function FormByKind({ kind, productType, massivaOs, onComplete, onCancel }: FormByKindProps) {
  if (kind === 'script-integrado') {
    if (productType === 'Internet Link') {
      return (
        <InternetLinkScript onComplete={onComplete} onCancel={onCancel} massivaOs={massivaOs} />
      );
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
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Finalizado com abertura de OS
        </span>
        <p className="mt-4 text-xs font-medium text-zinc-500">Número da OS</p>
        <p className="mt-1 font-mono text-2xl font-medium text-zinc-900">{result.osNumber}</p>
        <p className="mt-3 text-sm text-zinc-600">
          A OS já está disponível no módulo Service Orders.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Fechar
        </button>
      </div>
    );
  }
  if (result.kind === 'fcr-registered') {
    return (
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          FCR registrado com sucesso
        </span>
        <p className="mt-4 text-xs font-medium text-zinc-500">Número do FCR</p>
        <p className="mt-1 font-mono text-2xl font-medium text-zinc-900">{result.fcrNumber}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Fechar
        </button>
      </div>
    );
  }
  return (
    <div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
        Finalizado sem abertura de OS
      </span>
      <p className="mt-4 text-sm text-zinc-600">
        Nenhuma OS foi gerada nesta finalização.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
      >
        Fechar
      </button>
    </div>
  );
}
