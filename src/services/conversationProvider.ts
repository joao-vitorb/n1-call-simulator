import type { DisclosureStyle, Scenario } from '../types/scenario';
import { findCompanyById } from '../utils/companies';
import { localCustomerReply } from './localCustomerProvider';

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

function disclosureRule(style: DisclosureStyle): string {
  if (style === 'forthcoming') {
    return '- Você está mais colaborativo: pode já adiantar seu nome e descrever o problema com suas palavras logo no começo, mas ainda assim de forma leiga.';
  }
  if (style === 'partial') {
    return '- Você dá as informações pela metade: fala uma parte (o nome OU o problema) e o resto só quando o atendente perguntar.';
  }
  return '- Você fala pouco: dá quase nenhuma informação de início. O atendente precisa extrair tudo de você com perguntas.';
}

function buildSystemPrompt(scenario: Scenario): string {
  const company = findCompanyById(scenario.companyId);
  const firstName = scenario.contactName.split(' ')[0];
  const cnpj = company?.cnpj ?? '';
  const companyName = company?.tradeName || scenario.companyLegalName;
  const isTicketStatus = scenario.demandType === 'ticket-status';
  const reasonLine = isTicketStatus
    ? 'Você ligou para o suporte N1 da operadora para saber o status de um chamado seu que já está aberto.'
    : 'Você ligou para o suporte técnico N1 da operadora de telecom porque tem um problema no seu serviço.';
  const motiveLine = isTicketStatus
    ? `O motivo da sua ligação: ${scenario.symptom}.`
    : `O que você percebe e está te incomodando: ${scenario.symptom}.`;
  const ticketBlock = isTicketStatus
    ? [
        '',
        `Sobre o chamado: você só conhece o PROTOCOLO do seu chamado, que é ${scenario.ticketProtocol}. Informe esse protocolo quando o atendente pedir, ou diga que não tem em mãos agora (conforme o seu estilo). Você NÃO conhece o número da OS nem detalhes técnicos do chamado — apenas o protocolo.`,
        'Quando o atendente informar a situação do chamado, reaja como cliente: você pode aceitar, pedir prioridade, pedir para registrar uma observação, ou — se ele disser que o chamado foi encerrado — pedir para reabrir/reexecutar. Nunca cite termos do sistema interno.',
      ]
    : [];

  return [
    `Você é ${firstName} (nome completo ${scenario.contactName}), cliente da empresa ${scenario.companyLegalName}${companyName ? ` (${companyName})` : ''}.`,
    reasonLine,
    motiveLine,
    `Seu humor atual é: ${scenario.customerMood}. Deixe isso transparecer no tom, sem exagerar.`,
    '',
    'Dados que você conhece e fornece SOMENTE quando o atendente perguntar:',
    `- Seu nome: ${firstName} (na maioria das vezes diga só o primeiro nome; raramente o nome completo).`,
    `- Nome da empresa: ${scenario.companyLegalName}.`,
    cnpj ? `- CNPJ: ${cnpj}.` : '- CNPJ: diga que precisa procurar se perguntarem.',
    `- Telefone de contato: ${scenario.customerPhone}.`,
    'Você NÃO sabe de cor número de circuito, contrato ou dados técnicos da rede. Se perguntarem isso, diga que não sabe.',
    ...ticketBlock,
    '',
    'Como você se comporta:',
    disclosureRule(scenario.disclosureStyle),
    '- Responda SEMPRE em português brasileiro, em primeira pessoa, com frases curtas e naturais de quem está ao telefone.',
    '- Você é LEIGO em tecnologia. NUNCA use termos técnicos como circuito, mac address, pacote, latência, vlan, fcr, protocolo ou nome de produto/velocidade. Descreva só o que você sente ("parou", "tá caindo", "tá lento", "não consigo ligar", "tá picotando").',
    '- NUNCA diga o nome técnico do problema nem tente diagnosticar a causa. Você não sabe por que está acontecendo.',
    '- Responda só o que foi perguntado. Não despeje todas as informações de uma vez.',
    '- Quando o atendente afunilar com uma pergunta mais específica (ex.: "é pra todos os números ou só alguns?"), aí sim detalhe melhor o que está acontecendo.',
    '- Você NÃO é um assistente. Não ajude o atendente, não sugira soluções. Você é um cliente esperando ser atendido.',
    '- Se o atendente demorar, se enrolar ou não souber resolver, mostre impaciência condizente com o seu humor.',
    '- Se o atendente agir corretamente ou resolver, demonstre alívio ou agradecimento.',
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
  };

  const url = `${POLLINATIONS_ENDPOINT}?referrer=${encodeURIComponent(POLLINATIONS_REFERRER)}`;
  const response = await fetch(url, {
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

export const customerProvider: ConversationProvider = {
  async reply(scenario, history) {
    try {
      return await pollinationsProvider.reply(scenario, history);
    } catch {
      return localCustomerReply(scenario, history);
    }
  },
};
