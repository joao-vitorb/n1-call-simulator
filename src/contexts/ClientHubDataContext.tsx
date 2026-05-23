import { createContext, useContext, type ReactNode } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import type { GeneratedProtocol, Interaction } from '../types/interaction';

type ClientHubDataValue = {
  generatedProtocols: GeneratedProtocol[];
  interactions: Interaction[];
  registerProtocol: (protocol: GeneratedProtocol) => void;
  registerInteraction: (interaction: Interaction) => void;
};

const ClientHubDataContext = createContext<ClientHubDataValue | undefined>(undefined);

export function ClientHubDataProvider({ children }: { children: ReactNode }) {
  const [generatedProtocols, setGeneratedProtocols] = usePersistedState<GeneratedProtocol[]>(
    'n1_client_hub_generated_protocols',
    [],
  );
  const [interactions, setInteractions] = usePersistedState<Interaction[]>(
    'n1_client_hub_interactions',
    [],
  );

  function registerProtocol(protocol: GeneratedProtocol) {
    setGeneratedProtocols((prev) => [protocol, ...prev]);
  }

  function registerInteraction(interaction: Interaction) {
    setInteractions((prev) => [interaction, ...prev]);
  }

  return (
    <ClientHubDataContext.Provider
      value={{ generatedProtocols, interactions, registerProtocol, registerInteraction }}
    >
      {children}
    </ClientHubDataContext.Provider>
  );
}

export function useClientHubData() {
  const context = useContext(ClientHubDataContext);
  if (!context) {
    throw new Error('useClientHubData must be used inside ClientHubDataProvider');
  }
  return context;
}
