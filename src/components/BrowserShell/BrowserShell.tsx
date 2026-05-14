import { useState } from 'react';
import { TabBar } from './TabBar';
import type { TabId } from '../../types/tab';
import { TrainingCall } from '../../modules/TrainingCall/TrainingCall';
import { ClientHub } from '../../modules/ClientHub/ClientHub';
import { LinkTest } from '../../modules/LinkTest/LinkTest';
import { ServiceOrders } from '../../modules/ServiceOrders/ServiceOrders';

function renderActiveTab(tabId: TabId) {
  switch (tabId) {
    case 'training-call':
      return <TrainingCall />;
    case 'client-hub':
      return <ClientHub />;
    case 'link-test':
      return <LinkTest />;
    case 'service-orders':
      return <ServiceOrders />;
  }
}

export function BrowserShell() {
  const [activeTab, setActiveTab] = useState<TabId>('training-call');

  return (
    <div className="flex min-h-screen flex-col bg-zinc-200">
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 bg-white">{renderActiveTab(activeTab)}</main>
    </div>
  );
}
