export type GeneratedProtocol = {
  protocol: string;
  companyId: string;
  generatedBy: string;
  generatedAt: string;
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

export type Interaction = {
  id: string;
  protocol: string;
  companyId: string;
  summary: string;
  contactName: string;
  ddd: string;
  phone: string;
  createdBy: string;
  createdAt: string;
};
