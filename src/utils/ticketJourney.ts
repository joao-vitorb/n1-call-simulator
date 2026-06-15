import type { ServiceOrder, ServiceOrderNote } from '../types/serviceOrder';

const STAGE_ORDER = [
  'Investigação dados',
  'Aguardando agendamento técnico',
  'Aguardando execução em campo',
  'Aceite',
];

const STAGE_NOTES: string[][] = [
  [
    'Chamado aberto. Cliente relata indisponibilidade no serviço.',
    'Chamado em investigação de dados do circuito.',
  ],
  [
    'Investigação concluída. Necessária visita técnica para tratativa.',
    'Chamado encaminhado para agendamento com a equipe de campo.',
  ],
  [
    'Visita técnica agendada com a equipe de campo.',
    'Aguardando execução em campo.',
  ],
  [
    'Execução em campo concluída pela equipe técnica.',
    'Tratativa finalizada. Aguardando aceite do cliente; e-mail de confirmação enviado.',
  ],
];

const AUTHORS = ['backoffice.fake', 'noc.fake', 'campo.fake', 'suporte.fake'];

export function resolveStatus(order: ServiceOrder): string {
  if (order.status === 'Cancelado') return 'Cancelado';
  if (order.status === 'Interrompido') return 'Interrompido';
  if (order.status === 'Fechado' || order.finishedAt) return 'Fechado';
  if (order.stage === 'Investigação dados') return 'Aberto';
  return 'Em tratamento';
}

function addHours(iso: string, hours: number): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

export function buildJourneyNotes(order: ServiceOrder): ServiceOrderNote[] {
  const stageIndex = Math.max(0, STAGE_ORDER.indexOf(order.stage));
  const status = resolveStatus(order);
  const texts: string[] = [];

  if (status === 'Cancelado') {
    texts.push(STAGE_NOTES[0][0], 'Chamado cancelado a pedido do cliente.');
  } else {
    for (let i = 0; i <= stageIndex; i += 1) {
      texts.push(...STAGE_NOTES[i]);
    }
    if (status === 'Interrompido') {
      texts.push('Tratativa interrompida. Aguardando retorno para retomada.');
    } else if (status === 'Fechado') {
      texts.push('Cliente confirmou a tratativa. Chamado encerrado.');
    }
  }

  return texts.map((text, index) => {
    const isLast = index === texts.length - 1;
    const createdAt =
      isLast && order.finishedAt ? order.finishedAt : addHours(order.createdAt, index * 6);
    return { createdAt, author: AUTHORS[index % AUTHORS.length], text };
  });
}
