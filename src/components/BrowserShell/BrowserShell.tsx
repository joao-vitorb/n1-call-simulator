import type { ReactNode } from 'react';
import { TabBar } from './TabBar';
import type { TabId } from '../../types/tab';
import { usePersistedState } from '../../hooks/usePersistedState';
import { useTabOrder } from '../../hooks/useTabOrder';
import { useAuth } from '../../contexts/AuthContext';
import { TrainingCall } from '../../modules/TrainingCall/TrainingCall';
import { ClientHub } from '../../modules/ClientHub/ClientHub';
import { LinkTest } from '../../modules/LinkTest/LinkTest';
import { ServiceOrders } from '../../modules/ServiceOrders/ServiceOrders';

export function BrowserShell() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = usePersistedState<TabId>('n1_active_tab', 'training-call');
  const [tabOrder, setTabOrder] = useTabOrder(currentUser?.username ?? null);

  return (
    <div className="flex h-screen flex-col bg-white">
      <TabBar
        order={tabOrder}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReorder={setTabOrder}
      />
      <main className="flex flex-1 overflow-hidden bg-white">
        <ModulePane visible={activeTab === 'training-call'}>
          <TrainingCall />
        </ModulePane>
        <ModulePane visible={activeTab === 'client-hub'}>
          <ClientHub />
        </ModulePane>
        <ModulePane visible={activeTab === 'link-test'}>
          <LinkTest />
        </ModulePane>
        <ModulePane visible={activeTab === 'service-orders'}>
          <ServiceOrders />
        </ModulePane>
      </main>
    </div>
  );
}

type ModulePaneProps = {
  visible: boolean;
  children: ReactNode;
};

function ModulePane({ visible, children }: ModulePaneProps) {
  return <div className={visible ? 'flex flex-1' : 'hidden'}>{children}</div>;
}
