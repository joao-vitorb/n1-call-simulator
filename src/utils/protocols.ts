import type { Company } from '../types/company';
import type { GeneratedProtocol } from '../types/interaction';

export const TRAINING_CALL_AUTHOR = 'training-call';

export type ProtocolContext = {
  protocol: string;
  generatedBy: string;
  customerName: string;
  ddd1: string;
  phone1: string;
  ddd2: string;
  phone2: string;
  email: string;
  contactPreference: string;
  deliveryMethod: string;
  observation: string;
};

export function resolveProtocolContext(
  protocolNumber: string,
  company: Company,
  generatedProtocols: GeneratedProtocol[],
): ProtocolContext | null {
  const seed = company.protocols.find((item) => item.protocol === protocolNumber);
  if (seed) {
    return {
      protocol: seed.protocol,
      generatedBy: TRAINING_CALL_AUTHOR,
      customerName: seed.customerName,
      ddd1: seed.phone1.ddd,
      phone1: seed.phone1.number,
      ddd2: seed.phone2?.ddd ?? '',
      phone2: seed.phone2?.number ?? '',
      email: seed.email,
      contactPreference: seed.contactPreference,
      deliveryMethod: seed.deliveryMethod,
      observation: seed.observation,
    };
  }

  const generated = generatedProtocols.find(
    (item) => item.protocol === protocolNumber && item.companyId === company.id,
  );
  if (generated) {
    return {
      protocol: generated.protocol,
      generatedBy: generated.generatedBy,
      customerName: generated.customerName,
      ddd1: generated.ddd1,
      phone1: generated.phone1,
      ddd2: generated.ddd2,
      phone2: generated.phone2,
      email: generated.email,
      contactPreference: generated.contactPreference,
      deliveryMethod: generated.deliveryMethod,
      observation: generated.observation,
    };
  }

  return null;
}

export function findGeneratedProtocolCompanyId(
  protocolNumber: string,
  generatedProtocols: GeneratedProtocol[],
): string | null {
  const found = generatedProtocols.find((item) => item.protocol === protocolNumber);
  return found?.companyId ?? null;
}

export function parseCustomerPhone(value: string): { ddd: string; number: string } {
  const match = value.match(/\((\d{2})\)\s*(.+)/);
  if (match) {
    return { ddd: match[1], number: match[2].trim() };
  }
  return { ddd: '', number: value.trim() };
}
