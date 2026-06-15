import { createContext, useContext, type ReactNode } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import type { ServiceOrder, ServiceOrderContact, ServiceOrderNote } from '../types/serviceOrder';

type TicketUpdate = {
  status?: string;
  stage?: string;
  finishedAt?: string | null;
  contact?: ServiceOrderContact;
  notes: ServiceOrderNote[];
};

type TicketUpdatesMap = Record<string, TicketUpdate>;

type TicketUpdatePartial = {
  status?: string;
  stage?: string;
  finishedAt?: string | null;
  contact?: ServiceOrderContact;
  note?: ServiceOrderNote;
};

type TicketUpdatesValue = {
  updateTicket: (orderNumber: string, partial: TicketUpdatePartial) => void;
  mergeOrder: (order: ServiceOrder) => ServiceOrder;
};

const TicketUpdatesContext = createContext<TicketUpdatesValue | undefined>(undefined);

export function TicketUpdatesProvider({ children }: { children: ReactNode }) {
  const [updates, setUpdates] = usePersistedState<TicketUpdatesMap>('n1_ticket_updates', {});

  function updateTicket(orderNumber: string, partial: TicketUpdatePartial) {
    setUpdates((prev) => {
      const existing = prev[orderNumber] ?? { notes: [] };
      const next: TicketUpdate = {
        status: partial.status ?? existing.status,
        stage: partial.stage ?? existing.stage,
        finishedAt:
          partial.finishedAt !== undefined ? partial.finishedAt : existing.finishedAt,
        contact: partial.contact ?? existing.contact,
        notes: partial.note ? [...existing.notes, partial.note] : existing.notes,
      };
      return { ...prev, [orderNumber]: next };
    });
  }

  function mergeOrder(order: ServiceOrder): ServiceOrder {
    const update = updates[order.serviceOrderNumber];
    if (!update) return order;
    return {
      ...order,
      status: update.status ?? order.status,
      stage: update.stage ?? order.stage,
      finishedAt: update.finishedAt !== undefined ? update.finishedAt : order.finishedAt,
      contact: update.contact ?? order.contact,
      notes: [...order.notes, ...update.notes],
    };
  }

  return (
    <TicketUpdatesContext.Provider value={{ updateTicket, mergeOrder }}>
      {children}
    </TicketUpdatesContext.Provider>
  );
}

export function useTicketUpdates() {
  const context = useContext(TicketUpdatesContext);
  if (!context) {
    throw new Error('useTicketUpdates must be used inside TicketUpdatesProvider');
  }
  return context;
}
