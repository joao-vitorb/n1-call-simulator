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
