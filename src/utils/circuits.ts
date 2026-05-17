import { companies } from '../data/seed';
import type { Contract } from '../types/contract';

export function findContractByCircuit(circuit: string): Contract | null {
  const value = circuit.trim();
  if (!value) return null;
  for (const company of companies) {
    const found = company.contracts.find((contract) => contract.circuit === value);
    if (found) return found;
  }
  return null;
}
