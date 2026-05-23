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
import {
  resolveProtocolContext,
  parseCustomerPhone,
  TRAINING_CALL_AUTHOR,
  type ProtocolContext,
} from '../../utils/protocols';
import { findCompanyById } from '../../utils/companies';
import { useTrainingSession } from '../../contexts/TrainingSessionContext';
import { useClientHubData } from '../../contexts/ClientHubDataContext';
import { usePersistedState } from '../../hooks/usePersistedState';
import type { Company } from '../../types/company';
import type { CompanyTabId } from './CompanyTabs';

const EMPTY_FIELDS: SearchFields = { legalName: '', cnpj: '', protocol: '', circuit: '' };

type CompanyView = {
  tab: CompanyTabId;
  contractId: string | null;
};

export function ClientHub() {
  const { activeCall } = useTrainingSession();
  const { generatedProtocols } = useClientHubData();
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

  let protocolContext: ProtocolContext | null = null;
  if (contextProtocolNumber && selectedCompany) {
    if (activeCall && activeCall.formState.protocol === contextProtocolNumber) {
      const phone = parseCustomerPhone(activeCall.scenario.customerPhone);
      protocolContext = {
        protocol: contextProtocolNumber,
        generatedBy: TRAINING_CALL_AUTHOR,
        customerName: activeCall.scenario.contactName,
        ddd1: phone.ddd,
        phone1: phone.number,
        ddd2: '',
        phone2: '',
        email: '',
        contactPreference: '',
        deliveryMethod: '',
        observation: '',
      };
    } else {
      protocolContext = resolveProtocolContext(
        contextProtocolNumber,
        selectedCompany,
        generatedProtocols,
      );
    }
  }

  function openCompany(
    companyId: string,
    options: { protocol: string | null; view: CompanyView },
  ) {
    setSearchError(null);
    setNameResults(null);
    setSelectedCompanyId(companyId);
    setContextProtocolNumber(options.protocol);
    setCompanyView(options.view);
  }

  function handleFieldChange(field: keyof SearchFields, value: string) {
    setSearchFields({ ...EMPTY_FIELDS, [field]: value });
  }

  function handleSearch(type: SearchType, value: string) {
    const trimmed = value.trim();

    if (type === 'protocol' && activeCall && activeCall.formState.protocol === trimmed) {
      const company = findCompanyById(activeCall.scenario.companyId);
      if (company) {
        openCompany(company.id, { protocol: trimmed, view: { tab: 'cliente', contractId: null } });
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
      openCompany(hit.company.id, {
        protocol: null,
        view: { tab: 'contratos', contractId: hit.contract?.id ?? null },
      });
      return;
    }

    if (type === 'protocol') {
      const seedHit = searchCompany('protocol', trimmed);
      if (seedHit?.protocol) {
        openCompany(seedHit.company.id, {
          protocol: seedHit.protocol.protocol,
          view: { tab: 'cliente', contractId: null },
        });
        return;
      }
      const cleaned = trimmed.replace(/\D/g, '');
      const generated = generatedProtocols.find((item) => item.protocol === cleaned);
      if (generated) {
        const company = findCompanyById(generated.companyId);
        if (company) {
          openCompany(company.id, {
            protocol: generated.protocol,
            view: { tab: 'cliente', contractId: null },
          });
          return;
        }
      }
      setSearchError('Nenhum resultado encontrado.');
      return;
    }

    const result = searchCompany(type, trimmed);
    if (!result) {
      setSearchError('Nenhum resultado encontrado.');
      return;
    }
    openCompany(result.company.id, { protocol: null, view: { tab: 'cliente', contractId: null } });
  }

  function handleClearSearch() {
    setSearchFields(EMPTY_FIELDS);
    setSelectedCompanyId(null);
    setContextProtocolNumber(null);
    setNameResults(null);
    setSearchError(null);
  }

  function handleSelectCompany(company: Company) {
    openCompany(company.id, { protocol: null, view: { tab: 'cliente', contractId: null } });
  }

  function handleProtocolGenerated(protocolNumber: string) {
    setContextProtocolNumber(protocolNumber);
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
        protocolContext={protocolContext}
        initialTab={companyView.tab}
        initialContractId={companyView.contractId}
        onProtocolGenerated={handleProtocolGenerated}
        onFinalizeInteraction={handleClearSearch}
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
