import { useState } from 'react';
import serviceOrdersLogo from '../../assets/logos/service-orders.svg';
import { searchServiceOrders, type SomScope, type SomSearchFilters } from '../../utils/serviceOrders';
import { useCreatedOrders } from '../../contexts/CreatedOrdersContext';
import { useTicketUpdates } from '../../contexts/TicketUpdatesContext';
import { resolveStatus } from '../../utils/ticketJourney';
import { usePersistedState } from '../../hooks/usePersistedState';
import type { ServiceOrder } from '../../types/serviceOrder';
import { SomSearchForm } from './SomSearchForm';
import { SomResultsTable } from './SomResultsTable';
import { SomOrderPage } from './SomOrderPage';

export function ServiceOrders() {
  const { createdOrders } = useCreatedOrders();
  const { mergeOrder } = useTicketUpdates();
  const [scope, setScope] = usePersistedState<SomScope>('n1_som_scope', 'busca');
  const [results, setResults] = useState<ServiceOrder[] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

  function handleSearch(filters: SomSearchFilters) {
    setSelectedOrder(null);
    setResults(searchServiceOrders(filters, scope, createdOrders));
  }

  function handleClear() {
    setResults(null);
    setSelectedOrder(null);
  }

  function handleScopeChange(next: SomScope) {
    if (next === scope) return;
    setScope(next);
    setResults(null);
    setSelectedOrder(null);
  }

  if (selectedOrder) {
    return <SomOrderPage order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <section className="flex flex-1 flex-col gap-6 overflow-y-auto bg-zinc-50 p-6">
      <header className="flex items-center self-start rounded-xl bg-indigo-600 px-6 py-4 animate-fade-in">
        <img src={serviceOrdersLogo} alt="Service Orders" className="h-16 w-auto" />
      </header>

      <nav className="flex gap-1 rounded-lg border border-zinc-200 bg-white p-1 self-start animate-fade-in">
        <ScopeButton active={scope === 'busca'} onClick={() => handleScopeChange('busca')}>
          Busca
        </ScopeButton>
        <ScopeButton active={scope === 'busca-b2b'} onClick={() => handleScopeChange('busca-b2b')}>
          Busca B2B
        </ScopeButton>
      </nav>

      <SomSearchForm scope={scope} onSearch={handleSearch} onClear={handleClear} />

      {results !== null && (
        <SomResultsTable
          results={results.map((order) => {
            const merged = mergeOrder(order);
            return { ...merged, status: resolveStatus(merged) };
          })}
          onSelect={setSelectedOrder}
        />
      )}
    </section>
  );
}

type ScopeButtonProps = {
  active: boolean;
  onClick: () => void;
  children: string;
};

function ScopeButton({ active, onClick, children }: ScopeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
        active ? 'bg-indigo-600 text-white' : 'text-zinc-600 hover:bg-zinc-50'
      }`}
    >
      {children}
    </button>
  );
}
