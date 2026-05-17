import { companies } from '../data/seed';
import type { Company } from '../types/company';
import type { Contract } from '../types/contract';

export function findCompanyById(id: string): Company | null {
  return companies.find((company) => company.id === id) ?? null;
}

export type ContractLookup = {
  company: Company;
  contract: Contract;
};

export function findContractByNumber(contractNumber: string): ContractLookup | null {
  const trimmed = contractNumber.trim();
  if (!trimmed) return null;
  for (const company of companies) {
    const contract = company.contracts.find((item) => item.contractNumber === trimmed);
    if (contract) return { company, contract };
  }
  return null;
}
