import { useEffect, useState } from 'react';
import clientHubLogo from '../../assets/logos/client-hub.svg';
import { CompanySearchCard } from './CompanySearchCard';
import { ProtocolPanel } from './ProtocolPanel';
import { InteractionPanel } from './InteractionPanel';
import { CompanyHeader } from './CompanyHeader';
import { CompanyTabs, type CompanyTabId } from './CompanyTabs';
import { CompanyClient } from './CompanyClient';
import { CompanyContracts } from './CompanyContracts';
import { TechFormModal, type TechFormKind } from './ScriptIntegrado/TechFormModal';
import type { Company } from '../../types/company';
import type { Contract } from '../../types/contract';
import type { CompanySearchProps } from '../../utils/search';
import type { ProtocolContext } from '../../utils/protocols';

type ClientHubCompanyProps = CompanySearchProps & {
  company: Company;
  protocolContext: ProtocolContext | null;
  initialTab: CompanyTabId;
  initialContractId: string | null;
  onProtocolGenerated: (protocolNumber: string) => void;
  onFinalizeInteraction: () => void;
};

export function ClientHubCompany({
  company,
  protocolContext,
  initialTab,
  initialContractId,
  onProtocolGenerated,
  onFinalizeInteraction,
  ...searchProps
}: ClientHubCompanyProps) {
  const [activeTab, setActiveTab] = useState<CompanyTabId>(initialTab);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    initialContractId
      ? company.contracts.find((contract) => contract.id === initialContractId) ?? null
      : null,
  );
  const [openTechForm, setOpenTechForm] = useState<TechFormKind | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    setSelectedContract(
      initialContractId
        ? company.contracts.find((contract) => contract.id === initialContractId) ?? null
        : null,
    );
  }, [company.id, initialTab, initialContractId, company.contracts]);

  return (
    <section className="flex flex-1 bg-zinc-50">
      <aside className="flex w-[340px] shrink-0 flex-col gap-4 overflow-y-auto border-r border-zinc-200 bg-white p-5">
        <div>
          <span className="flex w-53 h-22 items-center rounded-xl bg-indigo-600">
            <img src={clientHubLogo} alt="Client Hub" className="h-40 w-40 ml-5" />
          </span>
        </div>
        <CompanySearchCard {...searchProps} />
        <ProtocolPanel
          company={company}
          protocolContext={protocolContext}
          onProtocolGenerated={onProtocolGenerated}
        />
        {protocolContext && (
          <InteractionPanel
            company={company}
            protocolContext={protocolContext}
            onFinalize={onFinalizeInteraction}
          />
        )}
      </aside>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <CompanyHeader company={company} />
        <CompanyTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasSelectedContract={selectedContract !== null}
          onOpenTechForm={setOpenTechForm}
        />
        <div className="flex-1 px-8 py-6">
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

      {openTechForm && selectedContract && (
        <TechFormModal
          kind={openTechForm}
          company={company}
          contract={selectedContract}
          onClose={() => setOpenTechForm(null)}
        />
      )}
    </section>
  );
}
