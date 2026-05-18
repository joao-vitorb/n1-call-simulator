import { companies } from '../data/seed';
import type { Company } from '../types/company';
import type { Contract } from '../types/contract';
import type { ServiceOrder, ServiceOrderNote, ServiceOrderType } from '../types/serviceOrder';

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
  extra: ServiceOrder[] = [],
): ServiceOrder[] {
  const protocol = filters.protocol?.trim() ?? '';
  const osNumber = filters.serviceOrderNumber?.trim() ?? '';
  const circuit = filters.circuit?.trim() ?? '';
  const cnpj = filters.cnpj?.replace(/\D/g, '') ?? '';

  const pool: ServiceOrder[] = [...extra, ...getAllServiceOrders()];

  return pool.filter((order) => {
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

export type BuildServiceOrderInput = {
  type: ServiceOrderType;
  company: Company;
  contract: Contract;
  osNumber: string;
  protocol: string;
  createdBy: string;
  observation?: string;
};

export function buildServiceOrder(input: BuildServiceOrderInput): ServiceOrder {
  const createdAt = new Date().toISOString();
  const dueAt = new Date(Date.now() + input.contract.slaHours * 60 * 60 * 1000).toISOString();
  const observation = input.observation?.trim() ?? '';
  const notes: ServiceOrderNote[] = observation
    ? [{ createdAt, author: input.createdBy, text: observation }]
    : [];
  return {
    protocol: input.protocol,
    serviceOrderNumber: input.osNumber,
    type: input.type,
    status: 'Aberto',
    stage: 'Investigação dados',
    customerLegalName: input.company.legalName,
    cnpj: input.company.cnpj,
    circuit: input.contract.circuit,
    contractNumber: input.contract.contractNumber,
    product: input.contract.productName,
    productType: input.contract.productType,
    regional: input.contract.regional,
    locality: `${input.contract.address.city} - ${input.contract.address.state}`,
    installationDate: input.contract.installedAt,
    contact: {
      name: input.company.responsibleContact.name,
      phone: input.company.responsibleContact.phone,
      email: input.company.responsibleContact.email,
    },
    createdAt,
    createdBy: input.createdBy,
    finishedAt: null,
    slaHours: input.contract.slaHours,
    dueAt,
    notes,
  };
}
