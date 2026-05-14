import type { Phone } from './company';
import type { ProductType } from './contract';

export type ServiceOrderType = 'Incidente' | 'Visita técnica' | 'Programação de serviços' | 'RFO';

export type ServiceOrderContact = {
  name: string;
  phone: Phone;
  email: string;
};

export type ServiceOrderNote = {
  createdAt: string;
  author: string;
  text: string;
};

export type ServiceOrder = {
  protocol: string;
  serviceOrderNumber: string;
  type: ServiceOrderType;
  status: string;
  stage: string;
  customerLegalName: string;
  cnpj: string;
  circuit: string;
  contractNumber: string;
  product: string;
  productType: ProductType;
  regional: string;
  locality: string;
  installationDate: string;
  contact: ServiceOrderContact;
  createdAt: string;
  createdBy: string;
  finishedAt: string | null;
  slaHours: number;
  dueAt: string;
  notes: ServiceOrderNote[];
};
