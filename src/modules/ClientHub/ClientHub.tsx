import { useState } from 'react';
import { ClientHubMain } from './ClientHubMain';
import { ClientHubResults } from './ClientHubResults';
import { ClientHubCompany } from './ClientHubCompany';
import {
  searchCompany,
  searchCompaniesByName,
  type SearchFields,
  type SearchType,
} from '../../utils/search';
import { findCompanyById } from '../../utils/companies';
import { useTrainingSession } from '../../contexts/TrainingSessionContext';
import { usePersistedState } from '../../hooks/usePersistedState';
import type { Company } from '../../types/company';
import type { Protocol } from '../../types/protocol';
import type { CompanyTabId } from './CompanyTabs';

const EMPTY_FIELDS: SearchFields = { legalName: '', cnpj: '', protocol: '', circuit: '' };

type CompanyView = {
  tab: CompanyTabId;
  contractId: string | null;
};

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
  const [searchFields, setSearchFields] = usePersistedState<SearchFields>(
    'n1_client_hub_search',
    EMPTY_FIELDS,
  );
  const [nameResults, setNameResults] = useState<Company[] | null>(null);
  const [companyView, setCompanyView] = useState<CompanyView>({ tab: 'cliente', contractId: null });
  const [searchError, setSearchError] = useState<string | null>(null);

  const selectedCompany = selectedCompanyId ? findCompanyById(selectedCompanyId) : null;
  const contextProtocol: Protocol | null =
    contextProtocolNumber && selectedCompany
      ? selectedCompany.protocols.find((p) => p.protocol === contextProtocolNumber) ?? null
      : null;

  function handleFieldChange(field: keyof SearchFields, value: string) {
    setSearchFields({ ...EMPTY_FIELDS, [field]: value });
  }

  function handleSearch(type: SearchType, value: string) {
    const trimmed = value.trim();

    if (type === 'protocol' && activeCall && activeCall.formState.protocol === trimmed) {
      const company = findCompanyById(activeCall.scenario.companyId);
      if (company) {
        setSearchError(null);
        setNameResults(null);
        setSelectedCompanyId(company.id);
        setContextProtocolNumber(null);
        setCompanyView({ tab: 'cliente', contractId: null });
        return;
      }
    }

    if (type === 'legalName') {
      const matches = searchCompaniesByName(trimmed);
      if (matches.length === 0) {
        setSearchError('Nenhum resultado encontrado.');
        return;
      }
      setSearchError(null);
      setSelectedCompanyId(null);
      setNameResults(matches);
      return;
    }

    if (type === 'circuit') {
      const hit = searchCompany('circuit', trimmed);
      if (!hit) {
        setSearchError('Nenhum resultado encontrado.');
        return;
      }
      setSearchError(null);
      setNameResults(null);
      setSelectedCompanyId(hit.company.id);
      setContextProtocolNumber(null);
      setCompanyView({ tab: 'contratos', contractId: hit.contract?.id ?? null });
      return;
    }

    const result = searchCompany(type, trimmed);
    if (!result) {
      setSearchError('Nenhum resultado encontrado.');
      return;
    }
    setSearchError(null);
    setNameResults(null);
    setSelectedCompanyId(result.company.id);
    setContextProtocolNumber(result.protocol?.protocol ?? null);
    setCompanyView({ tab: 'cliente', contractId: null });
  }

  function handleClearSearch() {
    setSearchFields(EMPTY_FIELDS);
    setSelectedCompanyId(null);
    setContextProtocolNumber(null);
    setNameResults(null);
    setSearchError(null);
  }

  function handleSelectCompany(company: Company) {
    setSelectedCompanyId(company.id);
    setNameResults(null);
    setContextProtocolNumber(null);
    setCompanyView({ tab: 'cliente', contractId: null });
  }

  const searchProps = {
    fields: searchFields,
    onFieldChange: handleFieldChange,
    onSearch: handleSearch,
    onClear: handleClearSearch,
    searchError,
  };

  if (selectedCompany) {
    return (
      <ClientHubCompany
        company={selectedCompany}
        contextProtocol={contextProtocol}
        initialTab={companyView.tab}
        initialContractId={companyView.contractId}
        {...searchProps}
      />
    );
  }

  if (nameResults) {
    return (
      <ClientHubResults
        results={nameResults}
        onSelectCompany={handleSelectCompany}
        {...searchProps}
      />
    );
  }

  return <ClientHubMain {...searchProps} />;
}
