import { companies } from '../data/seed';
import type { Company } from '../types/company';
import type { Contract } from '../types/contract';
import type { DisclosureStyle, Scenario, ScenarioDifficulty } from '../types/scenario';

type Symptom = {
  full: string;
  vague: string;
  category: string;
  label: string;
};

const MOODS = ['Calmo', 'Neutro', 'Preocupado', 'Impaciente', 'Irritado', 'Apressado'];
const GREETINGS = ['Alô', 'Oi, boa tarde', 'Boa tarde', 'Oi', 'Alô, boa tarde', 'Olá'];
const DISCLOSURE_STYLES: DisclosureStyle[] = ['forthcoming', 'partial', 'reserved'];
const DIFFICULTIES: ScenarioDifficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
const DDDS = ['11', '21', '31', '41', '51', '61', '71', '85'];

const INTERNET_OUTAGE = [
  'a internet parou de funcionar por completo',
  'estou totalmente sem internet aqui',
  'a internet caiu e não voltou mais',
];

const INTERNET_INTERMITTENT = [
  'a internet fica caindo toda hora',
  'a conexão tá oscilando demais, cai e volta direto',
  'a internet tá muito lenta e instável',
];

const INTERNET_FCR = [
  'a internet de vocês tá caindo direto',
  'a internet tá horrível, vive travando',
  'tá tudo muito lento, parece que a internet tá com problema',
];

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function chance(probability: number): boolean {
  return Math.random() < probability;
}

function buildInternetSymptom(category: 'outage' | 'intermittent' | 'fcr'): Symptom {
  if (category === 'outage') {
    return { full: pick(INTERNET_OUTAGE), vague: 'tô sem internet', category, label: 'Internet inoperante' };
  }
  if (category === 'fcr') {
    return { full: pick(INTERNET_FCR), vague: 'tô com problema na internet', category, label: 'FCR - circuito normal' };
  }
  return { full: pick(INTERNET_INTERMITTENT), vague: 'tô com problema na internet', category, label: 'Internet intermitente' };
}

function buildVoiceSymptom(): Symptom {
  const options: Symptom[] = [
    { full: 'as ligações estão picotando, corta a voz no meio', vague: 'tô com problema nas ligações', category: 'voz_picotando', label: 'Voz picotando' },
    { full: 'quando atendo a ligação fica muda, não escuto nada', vague: 'tô com problema no telefone', category: 'voz_muda', label: 'Ligação muda' },
    { full: 'tá dando um eco nas ligações, escuto a minha própria voz', vague: 'tô com problema nas ligações', category: 'voz_eco', label: 'Eco na ligação' },
    { full: 'não tô recebendo ligação de número nenhum', vague: 'tô com problema pra receber ligação', category: 'voz_sem_receber_todos', label: 'Não recebe de ninguém' },
    { full: 'não consigo ligar pra número nenhum', vague: 'tô com problema pra ligar', category: 'voz_sem_fazer_todos', label: 'Não faz ligações' },
    { full: 'não recebo ligação de alguns números específicos, de outros funciona normal', vague: 'tô com problema pra receber algumas ligações', category: 'voz_sem_receber_especificos', label: 'Não recebe de números específicos' },
    { full: 'não consigo ligar pra alguns números específicos, pra outros liga normal', vague: 'tô com problema pra ligar pra alguns números', category: 'voz_sem_fazer_especificos', label: 'Não faz para números específicos' },
    { full: `não consigo ligar pra números do DDD ${pick(DDDS)}, pros outros DDDs liga normal`, vague: 'tô com problema pra ligar pra fora', category: 'voz_sem_fazer_ddd', label: 'Não faz para um DDD' },
    { full: 'não consigo fazer nem receber ligações externas, só funciona ligação interna', vague: 'tô com problema nas ligações externas', category: 'voz_sem_externas', label: 'Sem ligações externas' },
  ];
  return pick(options);
}

type ContractPick = { company: Company; contract: Contract };

function collectActiveContracts(): ContractPick[] {
  const pairs: ContractPick[] = [];
  for (const company of companies) {
    for (const contract of company.contracts) {
      if (contract.status === 'Ativo') {
        pairs.push({ company, contract });
      }
    }
  }
  return pairs;
}

function resolveSymptom(contract: Contract): { symptom: Symptom; isFcr: boolean } {
  if (contract.productType === 'Voz Total') {
    return { symptom: buildVoiceSymptom(), isFcr: false };
  }

  if (contract.productType === 'Internet Link') {
    const profile = contract.satTestProfile;
    const code = profile.predefinedResult;
    if (profile.availableInSat && (code === null || code === 'LINK_OPERACIONAL_CLIENTE')) {
      return { symptom: buildInternetSymptom('fcr'), isFcr: true };
    }
    if (code === 'INTERMITTENT_PACKET_LOSS' || code === 'CPE_PACKET_LOSS') {
      return { symptom: buildInternetSymptom('intermittent'), isFcr: false };
    }
    if (code === 'SWITCH_NOT_LEARNING_MAC' || code === 'LINK_INOPERANTE_ALGAR' || code === 'NO_MANAGEMENT') {
      return { symptom: buildInternetSymptom('outage'), isFcr: false };
    }
    return { symptom: buildInternetSymptom(chance(0.5) ? 'outage' : 'intermittent'), isFcr: false };
  }

  return { symptom: buildInternetSymptom(chance(0.5) ? 'outage' : 'intermittent'), isFcr: false };
}

function buildOpeningLine(
  style: DisclosureStyle,
  firstName: string,
  companyName: string,
  symptom: Symptom,
): string {
  const greeting = pick(GREETINGS);
  if (style === 'forthcoming') {
    return `${greeting}, aqui é ${firstName} da ${companyName}. ${capitalize(symptom.full)}.`;
  }
  if (style === 'partial') {
    if (chance(0.5)) {
      return `${greeting}, aqui é ${firstName}. ${capitalize(symptom.vague)}.`;
    }
    return `${greeting}. ${capitalize(symptom.full)}.`;
  }
  return chance(0.5) ? `${greeting}.` : `${greeting}, preciso de ajuda aqui.`;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toneForMood(mood: string): string {
  if (mood === 'Irritado' || mood === 'Impaciente') return 'tenso';
  if (mood === 'Preocupado') return 'preocupado';
  if (mood === 'Apressado') return 'apressado';
  return 'neutro';
}

export function pickRandomScenario(): Scenario {
  const pairs = collectActiveContracts();
  const { company, contract } = pick(pairs);
  const { symptom, isFcr } = resolveSymptom(contract);

  const contactName = company.responsibleContact.name;
  const firstName = contactName.split(' ')[0];
  const companyShortName = company.tradeName || company.legalName;
  const phone = company.responsibleContact.phone;
  const style = pick(DISCLOSURE_STYLES);
  const mood = pick(MOODS);
  const hasOpenOrder = contract.serviceOrders.some((order) => order.finishedAt === null);

  return {
    id: `scenario_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
    difficulty: pick(DIFFICULTIES),
    companyId: company.id,
    companyLegalName: company.legalName,
    contactName,
    customerPhone: `(${phone.ddd}) ${phone.number}`,
    productType: contract.productType,
    productName: contract.productName,
    contractNumber: contract.contractNumber,
    circuit: contract.circuit,
    scenarioType: symptom.label,
    customerMood: mood,
    openingLine: buildOpeningLine(style, firstName, companyShortName, symptom),
    hasOpenServiceOrderForSameCircuit: hasOpenOrder,
    expectedActions: ['confirm_customer_data', 'search_company_in_crm', 'run_link_test', 'categorize_call', 'save_call'],
    correctSlaHoursToInform: contract.slaHours,
    voiceProfile: {
      tone: toneForMood(mood),
      speed: pick(['Normal', 'Rápida', 'Pausada']),
      formality: pick(['Informal', 'Neutra']),
    },
    symptom: symptom.full,
    faultCategory: symptom.category,
    isFcr,
    disclosureStyle: style,
  };
}
