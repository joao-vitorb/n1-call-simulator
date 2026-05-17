import { createContext, useContext, useState, type ReactNode } from 'react';
import { findCompanyById, findContractByNumber } from '../utils/companies';
import { generateProtocol } from '../utils/protocolGenerator';
import type { CallEntry, CallFormState } from '../types/trainingCall';
import type { Scenario } from '../types/scenario';

function buildInitialFormState(scenario: Scenario): CallFormState {
  const company = findCompanyById(scenario.companyId);
  const lookup = findContractByNumber(scenario.contractNumber);
  const contract = lookup?.contract;
  return {
    level1: '',
    level2: '',
    level3: '',
    protocol: generateProtocol(),
    legalName: scenario.companyLegalName,
    cnpj: company?.cnpj ?? '',
    segment: company?.segment ?? '',
    circuit: scenario.circuit,
    product: scenario.productName,
    locality: contract ? `${contract.address.city} - ${contract.address.state}` : '',
    hasCallback: '',
    callbackProtocol: '',
    observation: '',
  };
}

type TrainingSessionValue = {
  onlineSince: string;
  activeCall: CallEntry | null;
  finishedCalls: CallEntry[];
  viewingCallId: string | null;
  receiveCall: (scenario: Scenario) => void;
  hangUp: () => void;
  selectFinishedCall: (id: string | null) => void;
  updateCallForm: (id: string, updates: Partial<CallFormState>) => void;
  saveCall: (id: string) => void;
};

const TrainingSessionContext = createContext<TrainingSessionValue | undefined>(undefined);

export function TrainingSessionProvider({ children }: { children: ReactNode }) {
  const [onlineSince] = useState(() => new Date().toISOString());
  const [activeCall, setActiveCall] = useState<CallEntry | null>(null);
  const [finishedCalls, setFinishedCalls] = useState<CallEntry[]>([]);
  const [viewingCallId, setViewingCallId] = useState<string | null>(null);

  function receiveCall(scenario: Scenario) {
    const startedAt = new Date().toISOString();
    const entry: CallEntry = {
      id: startedAt,
      scenario,
      phoneNumber: scenario.customerPhone,
      startedAt,
      finishedAt: null,
      durationSeconds: null,
      formState: buildInitialFormState(scenario),
      saved: false,
    };
    setActiveCall(entry);
    setViewingCallId(null);
  }

  function hangUp() {
    if (!activeCall) return;
    const finishedAt = new Date().toISOString();
    const durationSeconds = Math.floor(
      (new Date(finishedAt).getTime() - new Date(activeCall.startedAt).getTime()) / 1000,
    );
    const finished: CallEntry = {
      ...activeCall,
      finishedAt,
      durationSeconds,
    };
    setFinishedCalls((prev) => [finished, ...prev]);
    setActiveCall(null);
  }

  function selectFinishedCall(id: string | null) {
    setViewingCallId(id);
  }

  function updateCallForm(id: string, updates: Partial<CallFormState>) {
    if (activeCall?.id === id) {
      setActiveCall((current) =>
        current ? { ...current, formState: { ...current.formState, ...updates } } : null,
      );
      return;
    }
    setFinishedCalls((prev) =>
      prev.map((call) =>
        call.id === id ? { ...call, formState: { ...call.formState, ...updates } } : call,
      ),
    );
  }

  function saveCall(id: string) {
    if (activeCall?.id === id) {
      setActiveCall((current) => (current ? { ...current, saved: true } : null));
      return;
    }
    setFinishedCalls((prev) =>
      prev.map((call) => (call.id === id ? { ...call, saved: true } : call)),
    );
  }

  return (
    <TrainingSessionContext.Provider
      value={{
        onlineSince,
        activeCall,
        finishedCalls,
        viewingCallId,
        receiveCall,
        hangUp,
        selectFinishedCall,
        updateCallForm,
        saveCall,
      }}
    >
      {children}
    </TrainingSessionContext.Provider>
  );
}

export function useTrainingSession() {
  const context = useContext(TrainingSessionContext);
  if (!context) {
    throw new Error('useTrainingSession must be used inside TrainingSessionProvider');
  }
  return context;
}
