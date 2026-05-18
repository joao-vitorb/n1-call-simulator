export type ScriptResult =
  | { kind: 'os-opened'; osNumber: string; observation?: string }
  | { kind: 'os-not-opened' }
  | { kind: 'fcr-registered'; fcrNumber: string };
