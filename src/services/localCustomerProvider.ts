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
  if (scenario.demandType === 'ticket-status') return 'queria saber do meu chamado';
  if (scenario.demandType === 'commercial') {
    if (scenario.faultCategory.includes('fatura')) return 'queria resolver uma coisa da fatura';
    if (scenario.faultCategory.includes('nf')) return 'preciso de um documento aí';
    if (scenario.faultCategory.includes('cancel')) return 'queria falar sobre o meu contrato';
    if (scenario.faultCategory.includes('desbloqueio')) return 'tô com o serviço bloqueado';
    return 'queria resolver uma coisa comercial';
  }
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
  const isServiceProblem =
    scenario.demandType === 'technical' ||
    (scenario.demandType === 'massiva' && scenario.faultCategory !== 'ticket-status');

  const lastAgent = [...history].reverse().find((message) => message.role === 'agent');
  const agentText = lastAgent ? normalize(lastAgent.text) : '';
  const agentCount = history.filter((message) => message.role === 'agent').length;

  if (!agentText) {
    return pick(['Oi, boa tarde.', 'Alô.', `Oi, aqui é ${firstName}.`]);
  }

  if (has(agentText, /\bnome\b|com quem (eu )?falo|quem (e|esta) falando/)) {
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
    has(agentText, /(qual|numero|n |me (passa|da|informa)|tem o|sabe o|informa).*(chamad|protocolo|\bos\b|ordem)/)
  ) {
    return pick([
      scenario.ticketProtocol,
      `É o ${scenario.ticketProtocol}.`,
      `O protocolo é ${scenario.ticketProtocol}.`,
    ]);
  }

  if (
    has(
      agentText,
      /momento|minuto|instante|segundinho|perai|aguard|espera|so um (momento|minuto|instante|segundo|pouco)|ja (volto|retorno|te respondo|ja te)|vou (ver|olhar|verificar|checar|consultar)|deixa eu (ver|olhar|checar|verificar|consultar)/,
    )
  ) {
    return pick(['Tá bom, tô no aguardo.', 'Ok, sem problema.', 'Pode verificar, eu espero.']) + moodFlavor(scenario);
  }

  if (has(agentText, /transferir|transferindo|setor responsavel|encaminhar|outro setor|passar pro setor/)) {
    return pick(['Tá bom, pode transferir.', 'Ok, obrigado.', 'Beleza, vou aguardar.']) + moodFlavor(scenario);
  }

  if (
    has(
      agentText,
      /encontrei|achei|localizei|aberto|em andamento|andamento|tratativa|investigac|investiga|equipe|verificac|prazo|previsao|sla|encerrad|finalizad|massiv|interno|rede interna|resolv/,
    )
  ) {
    return pick([
      'Ah, entendi. Então é só aguardar?',
      'Tá bom, obrigado pela informação.',
      'Certo. Tem previsão de resolver?',
      'Entendi. E o que eu faço agora?',
    ]) + moodFlavor(scenario);
  }

  if (isServiceProblem) {
    if (has(agentText, /quando|que horas|horario|desde quando|comec|faz quanto|ha quanto|quanto tempo (faz|que|isso)/)) {
      return pick([
        'Faz uns vinte minutos mais ou menos.',
        'Começou hoje de manhã.',
        'Agora há pouco, faz uns quinze minutos.',
        'Faz mais ou menos uma hora.',
      ]) + moodFlavor(scenario);
    }
    if (has(agentText, /reinici|resetar|\breset\b|desliga(r| e liga)|tira(r)? da tomada|tirou da tomada|ja tentou|ja reiniciou/)) {
      return pick([
        'Já reiniciei e não adiantou.',
        'Já desliguei e liguei de novo, continua igual.',
        'Tentei reiniciar o aparelho e nada.',
      ]) + moodFlavor(scenario);
    }
    if (has(agentText, /computador|aparelho|dispositivo|maquina|no wifi|no cabo|todos os|todo lugar|outros aparelhos|so (nesse|nele|um aparelho)/)) {
      return pick([
        'Tá tudo sem internet aqui.',
        'Não funciona em aparelho nenhum.',
        'É em todos, não pega em lugar nenhum.',
      ]) + moodFlavor(scenario);
    }
    if (has(agentText, /\bluz|\bled|sinal do modem|modem (ta|esta)|cor da luz|luzes|piscando/)) {
      return pick([
        'O modem tá com uma luz vermelha.',
        'Tem uma luz piscando aqui, diferente do normal.',
        'As luzes tão estranhas, não como sempre.',
      ]) + moodFlavor(scenario);
    }
  }

  const narrowing = has(
    agentText,
    /todos|algum|especific|ddd|recebendo|fazendo|origina|externa|interna|de novo|exatamente|como assim/,
  );

  if (
    narrowing ||
    has(agentText, /problema|acontec|ajud|motivo|como posso|o que.*(ocorr|houve|rolou)|me (conta|explica|fala)|qual.*(problema|situacao|caso)/)
  ) {
    const giveFull = scenario.disclosureStyle === 'forthcoming' || narrowing || agentCount >= 2;
    return giveFull ? `${capitalize(scenario.symptom)}.` : `${capitalize(vagueSymptom(scenario))}.`;
  }

  if (has(agentText, /obrigad|mais alguma|qualquer coisa|posso ajudar em algo|encerr|finaliz|tenha um|bom dia$|boa tarde$|ate (mais|logo)/)) {
    return pick(['Tá bom, obrigado.', 'Era só isso mesmo, obrigado.', 'Ok, valeu. Tchau.']);
  }

  if (has(agentText, /bom dia|boa tarde|boa noite|ola|alo|^oi/)) {
    return pick(['Oi, boa tarde.', 'Boa tarde.', 'Oi.']);
  }

  return pick([
    `Pois é, eu só queria resolver isso. ${capitalize(vagueSymptom(scenario))}.`,
    'Desculpa, não entendi bem. Pode repetir?',
    'Hmm, isso eu não sei te dizer.',
    `Olha, ${vagueSymptom(scenario)}, é o que eu sei.`,
  ]);
}
