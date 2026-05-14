import type { Protocol } from './protocol';
import type { Contract } from './contract';

export type Phone = {
  ddd: string;
  number: string;
};

export type Address = {
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  fullAddress: string;
};

export type Segment = 'Corporativo' | 'Empresarial' | 'Governamental' | 'Operadoras';

export type SubSegment = 'Black' | 'Platinum' | 'Gold' | 'Green';

export type ResponsibleContact = {
  name: string;
  email: string;
  phone: Phone;
  department: string;
  customerSince: string;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: Phone;
  active: boolean;
  department: string;
};

export type Consultant = {
  name: string;
  email: string;
  phone: Phone;
};

export type Company = {
  id: string;
  legalName: string;
  tradeName: string;
  cnpj: string;
  segment: Segment;
  subSegment: SubSegment;
  isGtd: boolean;
  mainAddress: Address;
  responsibleContact: ResponsibleContact;
  contacts: Contact[];
  consultant: Consultant;
  protocols: Protocol[];
  contracts: Contract[];
};
