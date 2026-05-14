import type { Address } from './company';
import type { ServiceOrder } from './serviceOrder';

export type ProductType = 'Internet Link' | 'Banda Larga' | 'Voz Total';

export type ContractStatus = 'Ativo' | 'Cancelado';

export type SatChecklistItem = {
  title: string;
  subtitle: string;
  passed: boolean;
  modalDetails: string;
};

export type SatTestProfile = {
  availableInSat: boolean;
  satMessage: string;
  predefinedResult: string | null;
  checklist: SatChecklistItem[];
};

export type Contract = {
  id: string;
  contractNumber: string;
  productType: ProductType;
  productName: string;
  circuit: string;
  address: Address;
  status: ContractStatus;
  hiredAt: string;
  canceledAt: string | null;
  installedAt: string;
  regional: string;
  slaHours: number;
  satTestProfile: SatTestProfile;
  serviceOrders: ServiceOrder[];
};
