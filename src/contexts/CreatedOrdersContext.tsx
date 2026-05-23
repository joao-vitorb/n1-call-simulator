import { createContext, useContext, type ReactNode } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import type { ServiceOrder } from '../types/serviceOrder';

type CreatedOrdersValue = {
  createdOrders: ServiceOrder[];
  registerOrder: (order: ServiceOrder) => void;
};

const CreatedOrdersContext = createContext<CreatedOrdersValue | undefined>(undefined);

export function CreatedOrdersProvider({ children }: { children: ReactNode }) {
  const [createdOrders, setCreatedOrders] = usePersistedState<ServiceOrder[]>(
    'n1_created_orders',
    [],
  );

  function registerOrder(order: ServiceOrder) {
    setCreatedOrders((prev) => [order, ...prev]);
  }

  return (
    <CreatedOrdersContext.Provider value={{ createdOrders, registerOrder }}>
      {children}
    </CreatedOrdersContext.Provider>
  );
}

export function useCreatedOrders() {
  const context = useContext(CreatedOrdersContext);
  if (!context) {
    throw new Error('useCreatedOrders must be used inside CreatedOrdersProvider');
  }
  return context;
}
