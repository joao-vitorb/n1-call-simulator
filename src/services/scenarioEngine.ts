import { trainingScenarios } from '../data/seed';
import type { Scenario, ScenarioDifficulty } from '../types/scenario';

export function pickRandomScenario(): Scenario {
  const index = Math.floor(Math.random() * trainingScenarios.length);
  return trainingScenarios[index];
}

export function pickScenarioByDifficulty(difficulty: ScenarioDifficulty): Scenario {
  const pool = trainingScenarios.filter((scenario) => scenario.difficulty === difficulty);
  if (pool.length === 0) return pickRandomScenario();
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

export function pickScenarioById(id: string): Scenario | null {
  return trainingScenarios.find((scenario) => scenario.id === id) ?? null;
}
