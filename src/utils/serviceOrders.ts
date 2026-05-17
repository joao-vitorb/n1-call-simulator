import { companies } from '../data/seed';
import type { Company } from '../types/company';
import type { ServiceOrder } from '../types/serviceOrder';

export type SomScope = 'busca' | 'busca-b2b';

export type SomSearchFilters = {
  protocol?: string;
  serviceOrderNumber?: string;
  circuit?: string;
  cnpj?: string;
};

export function getAllServiceOrders(): ServiceOrder[] {
  const all: ServiceOrder[] = [];
  for (const company of companies) {
    for (const contract of company.contracts) {
      for (const order of contract.serviceOrders) {
        all.push(order);
      }
    }
  }
  return all;
}

export function findCompanyByOrder(order: ServiceOrder): Company | null {
  for (const company of companies) {
    if (company.cnpj === order.cnpj) return company;
  }
  return null;
}

export function searchServiceOrders(
  filters: SomSearchFilters,
  scope: SomScope,
): ServiceOrder[] {
  const protocol = filters.protocol?.trim() ?? '';
  const osNumber = filters.serviceOrderNumber?.trim() ?? '';
  const circuit = filters.circuit?.trim() ?? '';
  const cnpj = filters.cnpj?.replace(/\D/g, '') ?? '';

  return getAllServiceOrders().filter((order) => {
    if (scope === 'busca' && order.productType !== 'Banda Larga') return false;
    if (
      scope === 'busca-b2b' &&
      order.productType !== 'Internet Link' &&
      order.productType !== 'Voz Total'
    ) {
      return false;
    }

    if (protocol) {
      if (scope === 'busca') {
        if (order.protocol !== protocol && order.serviceOrderNumber !== protocol) return false;
      } else if (order.protocol !== protocol) {
        return false;
      }
    }
    if (osNumber && order.serviceOrderNumber !== osNumber) return false;
    if (circuit && order.circuit !== circuit) return false;
    if (cnpj && order.cnpj.replace(/\D/g, '') !== cnpj) return false;

    return true;
  });
}
