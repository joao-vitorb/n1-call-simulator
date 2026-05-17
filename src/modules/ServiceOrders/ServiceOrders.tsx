import { useState } from 'react';
import { searchServiceOrders, type SomScope, type SomSearchFilters } from '../../utils/serviceOrders';
import type { ServiceOrder } from '../../types/serviceOrder';
import { SomSearchForm } from './SomSearchForm';
import { SomResultsTable } from './SomResultsTable';
import { SomOrderPage } from './SomOrderPage';

export function ServiceOrders() {
  const [scope, setScope] = useState<SomScope>('busca');
  const [results, setResults] = useState<ServiceOrder[] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

  function handleSearch(filters: SomSearchFilters) {
    setSelectedOrder(null);
    setResults(searchServiceOrders(filters, scope));
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
      <nav className="flex gap-2">
        <ScopeButton active={scope === 'busca'} onClick={() => handleScopeChange('busca')}>
          Busca
        </ScopeButton>
        <ScopeButton active={scope === 'busca-b2b'} onClick={() => handleScopeChange('busca-b2b')}>
          Busca B2B
        </ScopeButton>
      </nav>

      <SomSearchForm scope={scope} onSearch={handleSearch} onClear={handleClear} />

      {results !== null && <SomResultsTable results={results} onSelect={setSelectedOrder} />}
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
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-zinc-900 text-white'
          : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
      }`}
    >
      {children}
    </button>
  );
}
