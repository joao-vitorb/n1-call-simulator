import type { Scenario } from '../types/scenario';

export type ConversationRole = 'agent' | 'customer';

export type ConversationMessage = {
  role: ConversationRole;
  text: string;
  timestamp: string;
};

export type ConversationProvider = {
  reply: (scenario: Scenario, history: ConversationMessage[]) => Promise<string>;
};

const POLLINATIONS_ENDPOINT = 'https://text.pollinations.ai/openai';
const POLLINATIONS_MODELS = ['openai-fast', 'openai', 'mistral'];
const POLLINATIONS_REFERRER = 'n1-call-simulator';

const NOTICE_MARKERS = [
  'important notice',
  'pollinations legacy',
  'please migrate',
  'is being deprecated',
  'enter.pollinations.ai',
];

function buildSystemPrompt(scenario: Scenario): string {
  return [
    `Você é ${scenario.contactName} da empresa ${scenario.companyLegalName}.`,
    `Você ligou para o atendimento N1 da operadora.`,
    `Seu humor atual é: ${scenario.customerMood}.`,
    `Você está enfrentando o seguinte problema: ${scenario.scenarioType} no serviço ${scenario.productName}.`,
    `Você é cliente do contrato ${scenario.contractNumber}, circuito ${scenario.circuit}.`,
    '',
    'Regras de comportamento:',
    '- Responda SEMPRE em português brasileiro, em primeira pessoa, como um cliente real falando ao telefone.',
    '- Use frases curtas, naturais, como em uma ligação. Nunca formal demais.',
    '- NÃO seja prestativo nem assistente. Você é um cliente esperando ser atendido.',
    '- Se o atendente pedir CNPJ, nome, telefone ou dados que você teria, forneça com base no seu cenário.',
    '- Se o atendente for confuso, lento, ou não souber resolver, mostre impaciência condizente com o seu humor.',
    '- Se o atendente resolver ou agir corretamente, demonstre alívio ou agradecimento.',
    '- Você nunca encerra a ligação por conta própria; apenas responde.',
    '- Nunca quebre o papel: você é o cliente, ponto.',
  ].join('\n');
}

function toOpenAIMessage(message: ConversationMessage) {
  return {
    role: message.role === 'customer' ? 'assistant' : 'user',
    content: message.text,
  };
}

function looksLikeServiceNotice(text: string): boolean {
  const lowered = text.toLowerCase();
  return NOTICE_MARKERS.some((marker) => lowered.includes(marker));
}

async function requestModel(
  model: string,
  scenario: Scenario,
  history: ConversationMessage[],
): Promise<string> {
  const body = {
    model,
    messages: [
      { role: 'system', content: buildSystemPrompt(scenario) },
      ...history.map(toOpenAIMessage),
    ],
    private: true,
    referrer: POLLINATIONS_REFERRER,
  };

  const response = await fetch(POLLINATIONS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim() ?? '';
  if (!text) {
    throw new Error('resposta vazia');
  }
  if (looksLikeServiceNotice(text)) {
    throw new Error('aviso do serviço em vez de resposta');
  }
  return text;
}

export const pollinationsProvider: ConversationProvider = {
  async reply(scenario, history) {
    const errors: string[] = [];
    for (const model of POLLINATIONS_MODELS) {
      try {
        return await requestModel(model, scenario, history);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push(`${model}: ${message}`);
      }
    }
    throw new Error(
      `Nenhum modelo do Pollinations respondeu corretamente (${errors.join(' | ')}).`,
    );
  },
};
