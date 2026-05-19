import { useState } from 'react';
import { ClientHubMain } from './ClientHubMain';
import { ClientHubCompany } from './ClientHubCompany';
import { searchCompany, type SearchType } from '../../utils/search';
import { findCompanyById } from '../../utils/companies';
import { useTrainingSession } from '../../contexts/TrainingSessionContext';
import { usePersistedState } from '../../hooks/usePersistedState';
import type { Protocol } from '../../types/protocol';

export function ClientHub() {
  const { activeCall } = useTrainingSession();
  const [selectedCompanyId, setSelectedCompanyId] = usePersistedState<string | null>(
    'n1_client_hub_company_id',
    null,
  );
  const [contextProtocolNumber, setContextProtocolNumber] = usePersistedState<string | null>(
    'n1_client_hub_protocol',
    null,
  );
  const [searchError, setSearchError] = useState<string | null>(null);

  const selectedCompany = selectedCompanyId ? findCompanyById(selectedCompanyId) : null;
  const contextProtocol: Protocol | null =
    contextProtocolNumber && selectedCompany
      ? selectedCompany.protocols.find((p) => p.protocol === contextProtocolNumber) ?? null
      : null;

  function handleSearch(type: SearchType, value: string) {
    const trimmed = value.trim();
    if (type === 'protocol' && activeCall && activeCall.formState.protocol === trimmed) {
      const company = findCompanyById(activeCall.scenario.companyId);
      if (company) {
        setSelectedCompanyId(company.id);
        setContextProtocolNumber(null);
        setSearchError(null);
        return;
      }
    }
    const result = searchCompany(type, value);
    if (!result) {
      setSearchError('Nenhum resultado encontrado.');
      return;
    }
    setSearchError(null);
    setSelectedCompanyId(result.company.id);
    setContextProtocolNumber(result.protocol?.protocol ?? null);
  }

  function handleClearSearch() {
    setSelectedCompanyId(null);
    setContextProtocolNumber(null);
    setSearchError(null);
  }

  if (!selectedCompany) {
    return (
      <ClientHubMain
        onSearch={handleSearch}
        onClear={handleClearSearch}
        searchError={searchError}
      />
    );
  }

  return (
    <ClientHubCompany
      company={selectedCompany}
      contextProtocol={contextProtocol}
      onSearch={handleSearch}
      onClear={handleClearSearch}
      searchError={searchError}
    />
  );
}
