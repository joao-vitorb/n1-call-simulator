import type { Scenario } from './scenario';
import type { ConversationMessage } from '../services/conversationProvider';

export type CallFormState = {
  level1: string;
  level2: string;
  level3: string;
  protocol: string;
  legalName: string;
  cnpj: string;
  segment: string;
  circuit: string;
  product: string;
  locality: string;
  hasCallback: string;
  callbackProtocol: string;
  observation: string;
};

export type CallEntry = {
  id: string;
  scenario: Scenario;
  phoneNumber: string;
  startedAt: string;
  finishedAt: string | null;
  durationSeconds: number | null;
  formState: CallFormState;
  saved: boolean;
  messages: ConversationMessage[];
};
