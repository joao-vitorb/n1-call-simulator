import type { ServiceOrder, ServiceOrderNote } from '../types/serviceOrder';

export type MassivaEvent = {
  id: string;
  osNumber: string;
  maximoOs: string;
  cause: string;
  region: string;
  regional: string;
  affectedB2B: number;
  affectedB2C: number;
  protocol: string;
  createdAt: string;
};

const CAUSES = [
  'Duplo rompimento de anel óptico',
  'Queda de poste com rompimento de fibra',
  'Rompimento de fibra no backbone',
  'Falha em OLT da região',
  'Corte de fibra por obra de terceiros',
  'Falha de energia em site de agregação',
];

const REGIONS: [string, string][] = [
  ['São Paulo - SP', 'SP'],
  ['Rio de Janeiro - RJ', 'RJ'],
  ['Belo Horizonte - MG', 'MG'],
  ['Curitiba - PR', 'PR'],
  ['Porto Alegre - RS', 'RS'],
  ['Salvador - BA', 'BA'],
  ['Recife - PE', 'PE'],
  ['Goiânia - GO', 'GO'],
];

function hashString(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildEvents(): MassivaEvent[] {
  return REGIONS.map(([region, regional], index) => {
    const rng = makeRng(hashString(`massiva-${index}`));
    const num = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
    const digits = (count: number) =>
      Array.from({ length: count }, () => num(0, 9)).join('');
    return {
      id: `massiva-${index}`,
      osNumber: `003${digits(7)}`,
      maximoOs: `OS40${digits(6)}`,
      cause: CAUSES[num(0, CAUSES.length - 1)],
      region,
      regional,
      affectedB2B: num(20, 400),
      affectedB2C: num(300, 6000),
      protocol: `2026${digits(8)}`,
      createdAt: `2026-06-${String(10 + index).padStart(2, '0')}T08:00:00`,
    };
  });
}

const MASSIVA_EVENTS = buildEvents();

export function getMassivaForCircuit(circuit: string): MassivaEvent | null {
  const trimmed = circuit.trim();
  if (!trimmed) return null;
  const hash = hashString(trimmed);
  if (hash % 100 >= 8) return null;
  return MASSIVA_EVENTS[hash % MASSIVA_EVENTS.length];
}

export function getMassivaByOs(osNumber: string): MassivaEvent | null {
  return MASSIVA_EVENTS.find((event) => event.osNumber === osNumber) ?? null;
}

function addHours(iso: string, hours: number): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

export function massivaNotes(event: MassivaEvent): ServiceOrderNote[] {
  const texts = [
    `Evento massivo identificado na região: ${event.region}.`,
    `Causa: ${event.cause}.`,
    `Clientes impactados: ${event.affectedB2B} B2B e ${event.affectedB2C} B2C.`,
    `OS do Máximo associada: ${event.maximoOs}.`,
    'Equipes de campo acionadas. Tratativa em andamento.',
  ];
  return texts.map((text, index) => ({
    createdAt: addHours(event.createdAt, index),
    author: 'noc.fake',
    text,
  }));
}

function massivaToOrder(event: MassivaEvent): ServiceOrder {
  return {
    protocol: event.protocol,
    serviceOrderNumber: event.osNumber,
    type: 'Incidente',
    status: 'Em tratamento',
    stage: 'Aguardando execução em campo',
    customerLegalName: `Evento massivo · ${event.region}`,
    cnpj: '',
    circuit: '',
    contractNumber: '',
    product: 'Massiva',
    productType: 'Internet Link',
    regional: event.regional,
    locality: event.region,
    installationDate: '',
    contact: { name: 'NOC', phone: { ddd: '', number: '' }, email: '' },
    createdAt: event.createdAt,
    createdBy: 'noc.fake',
    finishedAt: null,
    slaHours: 4,
    dueAt: addHours(event.createdAt, 4),
    notes: massivaNotes(event),
  };
}

export function getMassivaOrders(): ServiceOrder[] {
  return MASSIVA_EVENTS.map(massivaToOrder);
}
