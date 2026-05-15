import { useState } from 'react';
import { ClientHubMain } from './ClientHubMain';
import { ClientHubCompany } from './ClientHubCompany';
import { searchCompany, type SearchType } from '../../utils/search';
import type { Company } from '../../types/company';
import type { Protocol } from '../../types/protocol';

export function ClientHub() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [contextProtocol, setContextProtocol] = useState<Protocol | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  function handleSearch(type: SearchType, value: string) {
    const result = searchCompany(type, value);
    if (!result) {
      setSearchError('Nenhum resultado encontrado.');
      return;
    }
    setSearchError(null);
    setSelectedCompany(result.company);
    setContextProtocol(result.protocol ?? null);
  }

  function handleClearSearch() {
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
