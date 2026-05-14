export type ActiveCall = {
  phoneNumber: string;
  startedAt: string;
};

export type FinishedCall = {
  phoneNumber: string;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
};
