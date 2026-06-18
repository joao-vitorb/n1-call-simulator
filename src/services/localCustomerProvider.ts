import { findCompanyById } from '../utils/companies';
import type { Scenario } from '../types/scenario';
import type { ConversationMessage } from './conversationProvider';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function has(text: string, pattern: RegExp): boolean {
  return pattern.test(text);
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function vagueSymptom(scenario: Scenario): string {
  if (scenario.faultCategory.startsWith('voz')) return 'tô com problema no telefone';
  return 'tô com problema na internet';
}

function moodFlavor(scenario: Scenario): string {
  if (scenario.customerMood === 'Irritado' || scenario.customerMood === 'Impaciente') {
    return pick([' Por favor, preciso de uma solução.', ' Isso já tá demorando.', '']);
  }
  return '';
}

export function localCustomerReply(scenario: Scenario, history: ConversationMessage[]): string {
  const company = findCompanyById(scenario.companyId);
  const firstName = scenario.contactName.split(' ')[0];
  const cnpj = company?.cnpj ?? '';

  const lastAgent = [...history].reverse().find((message) => message.role === 'agent');
  const agentText = lastAgent ? normalize(lastAgent.text) : '';
  const agentCount = history.filter((message) => message.role === 'agent').length;

  if (!agentText) {
    return pick(['Oi, boa tarde.', 'Alô.', `Oi, aqui é ${firstName}.`]);
  }

  if (has(agentText, /nome|com quem (eu )?falo|quem (e|esta) falando/)) {
    return pick([firstName, `É ${firstName}.`, `Meu nome é ${firstName}.`]);
  }

  if (has(agentText, /cnpj/)) {
    if (cnpj) return pick([cnpj, `Deixa eu ver... é ${cnpj}.`, `O CNPJ é ${cnpj}.`]);
    return 'Esse eu não sei te dizer agora, preciso procurar.';
  }

  if (has(agentText, /telefone|contato|numero pra (te )?ligar|numero de contato/)) {
    return `É ${scenario.customerPhone}.`;
  }

  if (has(agentText, /empresa|razao social|qual.*empresa/)) {
    return pick([scenario.companyLegalName, `Aqui é da ${scenario.companyLegalName}.`]);
  }

  if (
    scenario.ticketProtocol &&
    has(agentText, /chamado|protocolo|numero da os|ordem de servico/)
  ) {
    return pick([
      scenario.ticketProtocol,
      `É o ${scenario.ticketProtocol}.`,
      `O protocolo é ${scenario.ticketProtocol}.`,
    ]);
  }

  const narrowing = has(
    agentText,
    /todos|algum|especific|ddd|recebendo|fazendo|origina|externa|interna|so (alguns|um)|de novo|exatamente|como assim/,
  );

  if (
    narrowing ||
    has(agentText, /problema|acontec|ajud|motivo|como posso|o que.*(ocorr|houve|rolou)|me (conta|explica|fala)|qual.*(problema|situacao)/)
  ) {
    const giveFull = scenario.disclosureStyle === 'forthcoming' || narrowing || agentCount >= 2;
    return giveFull ? `${capitalize(scenario.symptom)}.` : `${capitalize(vagueSymptom(scenario))}.`;
  }

  if (has(agentText, /transferir|transferindo|setor responsavel|encaminhar|outro setor/)) {
    return pick(['Tá bom, pode transferir.', 'Ok, obrigado.', 'Beleza, vou aguardar.']) + moodFlavor(scenario);
  }

  if (has(agentText, /momento|aguard|verificar|checar|espera|so um|ja (volto|retorno)|vou (ver|olhar|verificar)|deixa eu (ver|olhar)/)) {
    return pick(['Tá bom, tô no aguardo.', 'Ok.', 'Sem problema, pode verificar.']) + moodFlavor(scenario);
  }

  if (has(agentText, /test|normal|internamente|rede interna|tecnico|resolv|chamado|ordem de servico|protocolo|prazo|sla|abrir/)) {
    return pick([
      'Ah tá, entendi.',
      'Certo. E quanto tempo isso vai levar?',
      'Tá bom. Então o problema é interno aqui?',
      'Entendi, e o que eu faço agora?',
    ]) + moodFlavor(scenario);
  }

  if (has(agentText, /obrigad|mais alguma|qualquer coisa|posso ajudar em algo|encerr|finaliz|tenha um/)) {
    return pick(['Tá bom, obrigado.', 'Era só isso mesmo, obrigado.', 'Ok, valeu.']);
  }

  if (has(agentText, /bom dia|boa tarde|boa noite|ola|alo|^oi/)) {
    return pick(['Oi, boa tarde.', 'Boa tarde.', 'Oi.']);
  }

  return pick([
    'Como assim?',
    `Não sei te dizer, só sei que ${vagueSymptom(scenario)}.`,
    'Desculpa, não entendi. Pode repetir?',
    `Olha, eu só queria resolver isso, ${vagueSymptom(scenario)}.`,
  ]);
}
