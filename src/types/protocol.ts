import type { Phone } from './company';

export type Protocol = {
  protocol: string;
  generatedAt: string;
  customerName: string;
  phone1: Phone;
  phone2: Phone | null;
  email: string;
  contactPreference: string;
  deliveryMethod: string;
  observation: string;
  interactionSummary: string;
  relatedContractId: string;
  relatedCircuit: string;
  relatedServiceOrderNumber: string | null;
};
