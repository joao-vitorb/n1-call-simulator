import type { ProductType } from './contract';
import type { Company } from './company';
import type { SeedUser } from './seedUser';

export type SeedMetadata = {
  name: string;
  version: string;
  totalCompanies: number;
  allDataIsFictional: boolean;
  allCompaniesSubSegment: string;
  defaultSlaHours: Record<ProductType, number>;
  identifierPatterns: {
    protocol: string;
    serviceOrder: string;
    circuit: string[];
    contract: string;
  };
};

export type FakeSeed = {
  metadata: SeedMetadata;
  traineeUsers: SeedUser[];
  supervisorUsers: SeedUser[];
  companies: Company[];
  trainingScenarioSeeds: unknown[];
};
