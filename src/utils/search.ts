import { companies } from '../data/seed';
import type { Company } from '../types/company';
import type { Contract } from '../types/contract';
import type { Protocol } from '../types/protocol';

export type SearchType = 'legalName' | 'cnpj' | 'protocol' | 'circuit';

export type SearchFields = {
  legalName: string;
  cnpj: string;
  protocol: string;
  circuit: string;
};

export type CompanySearchProps = {
  fields: SearchFields;
  onFieldChange: (field: keyof SearchFields, value: string) => void;
  onSearch: (type: SearchType, value: string) => void;
  onClear: () => void;
  searchError: string | null;
};

export type SearchHit = {
  company: Company;
  protocol?: Protocol;
  contract?: Contract;
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
    for (const company of companies) {
      const contract = company.contracts.find((item) => item.circuit === value);
      if (contract) {
        return { company, contract };
      }
    }
    return null;
  }

  return null;
}

export function searchCompaniesByName(rawValue: string): Company[] {
  const needle = rawValue.trim().toLowerCase();
  if (!needle) return [];
  return companies.filter((company) => company.legalName.toLowerCase().includes(needle));
}

export function isCompanyActive(company: Company): boolean {
  return company.contracts.some((contract) => contract.status === 'Ativo');
}
