import { useState } from 'react';
import { CompanySearchCard } from './CompanySearchCard';
import { ProtocolPanel } from './ProtocolPanel';
import { InteractionPanel } from './InteractionPanel';
import { CompanyHeader } from './CompanyHeader';
import { CompanyTabs, type CompanyTabId } from './CompanyTabs';
import { CompanyClient } from './CompanyClient';
import { CompanyContracts } from './CompanyContracts';
import type { Company } from '../../types/company';
import type { Protocol } from '../../types/protocol';
import type { Contract } from '../../types/contract';
import type { SearchType } from '../../utils/search';

type ClientHubCompanyProps = {
  company: Company;
  contextProtocol: Protocol | null;
  onSearch: (type: SearchType, value: string) => void;
  onClear?: () => void;
  searchError: string | null;
};

export function ClientHubCompany({
  company,
  contextProtocol,
  onSearch,
  onClear,
  searchError,
}: ClientHubCompanyProps) {
  const [activeTab, setActiveTab] = useState<CompanyTabId>('cliente');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  return (
    <section className="flex flex-1">
      <aside className="flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-r border-zinc-200 bg-zinc-50 p-4">
        <CompanySearchCard onSearch={onSearch} onClear={onClear} searchError={searchError} />
        <ProtocolPanel contextProtocol={contextProtocol} />
        <InteractionPanel />
      </aside>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <CompanyHeader company={company} />
        <CompanyTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasSelectedContract={selectedContract !== null}
        />
        <div className="flex-1 bg-zinc-50 p-6">
          {activeTab === 'cliente' && <CompanyClient company={company} />}
          {activeTab === 'contratos' && (
            <CompanyContracts
              company={company}
              selectedContract={selectedContract}
              onSelectContract={setSelectedContract}
            />
          )}
        </div>
      </div>
    </section>
  );
}
