import type { FakeSeed } from '../types/seed';
import fakeSeedJson from './fakeSeed.json';

export const seed = fakeSeedJson as FakeSeed;

export const seedMetadata = seed.metadata;
export const companies = seed.companies;
export const traineeUsers = seed.traineeUsers;
export const supervisorUsers = seed.supervisorUsers;
