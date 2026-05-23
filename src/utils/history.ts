import type { Company } from '../types/company';
import type { Interaction } from '../types/interaction';
import type { ServiceOrder } from '../types/serviceOrder';
import { TRAINING_CALL_AUTHOR } from './protocols';

export type HistoryRow = {
  id: string;
  protocol: string;
  summary: string;
  contactName: string;
  createdBy: string;
  createdAt: string;
  ddd: string;
  phone: string;
};

export function buildInteractionHistory(
  company: Company,
  sessionInteractions: Interaction[],
): HistoryRow[] {
  const seedRows: HistoryRow[] = company.protocols.map((protocol) => ({
    id: `seed-${protocol.protocol}`,
    protocol: protocol.protocol,
    summary: protocol.interactionSummary,
    contactName: protocol.customerName,
    createdBy: TRAINING_CALL_AUTHOR,
    createdAt: protocol.generatedAt,
    ddd: protocol.phone1.ddd,
    phone: protocol.phone1.number,
  }));

  const sessionRows: HistoryRow[] = sessionInteractions
    .filter((interaction) => interaction.companyId === company.id)
    .map((interaction) => ({
      id: interaction.id,
      protocol: interaction.protocol,
      summary: interaction.summary,
      contactName: interaction.contactName,
      createdBy: interaction.createdBy,
      createdAt: interaction.createdAt,
      ddd: interaction.ddd,
      phone: interaction.phone,
    }));

  return [...sessionRows, ...seedRows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function buildScriptHistory(
  company: Company,
  createdOrders: ServiceOrder[],
): HistoryRow[] {
  const seedOrders = company.contracts.flatMap((contract) => contract.serviceOrders);
  const sessionOrders = createdOrders.filter((order) => order.cnpj === company.cnpj);

  return [...sessionOrders, ...seedOrders]
    .map((order) => ({
      id: order.serviceOrderNumber,
      protocol: order.protocol,
      summary: order.notes[0]?.text ?? '',
      contactName: order.contact.name,
      createdBy: order.createdBy,
      createdAt: order.createdAt,
      ddd: order.contact.phone.ddd,
      phone: order.contact.phone.number,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function withinPeriod(createdAt: string, from: string, to: string): boolean {
  const date = createdAt.slice(0, 10);
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}
