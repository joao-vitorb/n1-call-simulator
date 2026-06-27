import { callPollinations, type ConversationMessage } from './conversationProvider';
import type { SacAttendant } from '../utils/sac';

export function sacOpeningLine(attendant: SacAttendant): string {
  const firstName = attendant.name.split(' ')[0];
  return `Boa tarde, me chamo ${firstName}, com quem eu falo?`;
}

function buildSacSystemPrompt(attendant: SacAttendant): string {
  const firstName = attendant.name.split(' ')[0];
  return [
    `Você é ${attendant.name}, atendente do SAC (setor comercial) da operadora. O seu ramal é ${attendant.extension}.`,
    'Você atendeu uma ligação interna (ramal 3002). Você abriu dizendo: "Boa tarde, me chamo ' +
      firstName +
      ', com quem eu falo?".',
    'Quem te liga PODE ser um atendente do suporte técnico (N1 ou HD) querendo te repassar um cliente com demanda comercial.',
    '',
    'Siga este fluxo, sempre em português brasileiro, em primeira pessoa, profissional, breve e cordial:',
    '1. Você só reconhece que está falando com um atendente quando ele disser que é do N1 ou do HD. Enquanto ele não disser, pergunte de novo com quem você fala / se ele é do suporte.',
    '2. Depois que ele se identificar como N1/HD, pergunte como você pode ajudar — MAS só se ele ainda não tiver dito a solicitação/demanda do cliente.',
    '3. Pergunte o nome do cliente — só se ele ainda não tiver informado.',
    '4. Pergunte o protocolo do atendimento — só se ele ainda não tiver informado.',
    `5. Quando você já tiver a solicitação, o nome do cliente E o protocolo, confirme que pode receber a transferência e informe o SEU ramal: "pode transferir pra mim, meu ramal é ${attendant.extension}".`,
    '',
    '- Pergunte UMA coisa por vez, e nunca peça algo que o atendente já informou.',
    '- Você NÃO é o cliente; você é a colega do SAC que vai receber a transferência. Nunca invente outros ramais além do seu.',
    '- Frases curtas e naturais de quem está ao telefone.',
  ].join('\n');
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export function sacReplyLocal(attendant: SacAttendant, history: ConversationMessage[]): string {
  const agentRaw = history
    .filter((message) => message.role === 'agent')
    .map((message) => message.text)
    .join(' ');
  const agentText = normalize(agentRaw);
  const lastAgentText = normalize(
    [...history].reverse().find((message) => message.role === 'agent')?.text ?? '',
  );

  if (/obrigad|valeu|bom trabalho|ate (mais|logo|breve)|tchau|falou|abraco|otimo|excelente/.test(lastAgentText)) {
    return pick([
      'Imagina! Pode transferir o cliente, tô no aguardo.',
      'De nada! Pode mandar, até mais.',
      'Tranquilo, qualquer coisa estou à disposição. Até mais!',
    ]);
  }

  const identified = /\bn1\b|\bhd\b|help ?desk|suporte|atendente|tecnic/.test(agentText);
  const hasDemand =
    /fatura|cancel|nota fiscal|desbloqueio|segunda via|bloquead|comercial|boleto|cobranca|financeiro/.test(
      agentText,
    );
  const hasProtocol = /protocolo|\d{8,}/.test(agentText);
  const hasName =
    /(cliente|nome|chama|senhor|senhora|sr\.?|sra\.?)\b[^.]{0,30}?[A-ZÀ-Ý][a-zà-ÿ]{2,}/.test(agentRaw);

  if (!identified) {
    return pick([
      'Desculpa, com quem eu falo? É do suporte?',
      'Você está me ligando do suporte? Com quem eu falo?',
    ]);
  }
  if (!hasDemand) {
    return pick(['Ah, do suporte! Como posso ajudar?', 'Entendi, do suporte. Qual a solicitação do cliente?']);
  }
  if (!hasName) {
    return pick(['Certo. Qual o nome do cliente?', 'Entendi. Me passa o nome do cliente, por favor?']);
  }
  if (!hasProtocol) {
    return pick(['E o protocolo do atendimento, por favor?', 'Perfeito. Qual o protocolo?']);
  }
  return pick([
    `Perfeito, pode transferir pra mim. Meu ramal é ${attendant.extension}.`,
    `Tudo certo, pode mandar o cliente. Meu ramal é ${attendant.extension}.`,
  ]);
}

export const sacProvider = {
  async reply(attendant: SacAttendant, history: ConversationMessage[]): Promise<string> {
    try {
      return await callPollinations(buildSacSystemPrompt(attendant), history);
    } catch {
      return sacReplyLocal(attendant, history);
    }
  },
};
