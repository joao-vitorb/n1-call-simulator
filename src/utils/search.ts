import { companies } from '../data/seed';
import type { Company } from '../types/company';
import type { Protocol } from '../types/protocol';

export type SearchType = 'legalName' | 'cnpj' | 'protocol' | 'circuit';

export type SearchHit = {
  company: Company;
  protocol?: Protocol;
};

export function searchCompany(type: SearchType, rawValue: string): SearchHit | null {
  const value = rawValue.trim();
  if (!value) return null;

  if (type === 'legalName') {
    const needle = value.toLowerCase();
    const found = companies.find((company) =>
      company.legalName.toLowerCase().includes(needle),
    );
    return found ? { company: found } : null;
  }

  if (type === 'cnpj') {
    const needle = value.replace(/\D/g, '');
    if (!needle) return null;
    const found = companies.find((company) => company.cnpj.replace(/\D/g, '') === needle);
    return found ? { company: found } : null;
  }

  if (type === 'protocol') {
    const needle = value.replace(/\D/g, '');
    if (!needle) return null;
    for (const company of companies) {
      const protocol = company.protocols.find((item) => item.protocol === needle);
      if (protocol) {
        return { company, protocol };
      }
    }
    return null;
  }

  if (type === 'circuit') {
    const found = companies.find((company) =>
      company.contracts.some((contract) => contract.circuit === value),
    );
    return found ? { company: found } : null;
  }

  return null;
}
