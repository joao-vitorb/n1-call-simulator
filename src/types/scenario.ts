import type { ProductType } from './contract';

export type ScenarioDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type DisclosureStyle = 'forthcoming' | 'partial' | 'reserved';

export type VoiceProfile = {
  tone: string;
  speed: string;
  formality: string;
};

export type Scenario = {
  id: string;
  difficulty: ScenarioDifficulty;
  companyId: string;
  companyLegalName: string;
  contactName: string;
  customerPhone: string;
  productType: ProductType;
  productName: string;
  contractNumber: string;
  circuit: string;
  scenarioType: string;
  customerMood: string;
  openingLine: string;
  hasOpenServiceOrderForSameCircuit: boolean;
  expectedActions: string[];
  correctSlaHoursToInform: number;
  voiceProfile: VoiceProfile;
  symptom: string;
  faultCategory: string;
  isFcr: boolean;
  disclosureStyle: DisclosureStyle;
};
