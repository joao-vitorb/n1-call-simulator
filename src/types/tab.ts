export type TabId = 'training-call' | 'client-hub' | 'link-test' | 'service-orders';

export type TabDefinition = {
  id: TabId;
  label: string;
};

export const TABS: TabDefinition[] = [
  { id: 'training-call', label: 'Training Call' },
  { id: 'client-hub', label: 'Client Hub' },
  { id: 'link-test', label: 'Link Test' },
  { id: 'service-orders', label: 'Service Orders' },
];

export const DEFAULT_TAB_ORDER: TabId[] = TABS.map((tab) => tab.id);

export const TAB_BY_ID = Object.fromEntries(
  TABS.map((tab) => [tab.id, tab]),
) as Record<TabId, TabDefinition>;
