export type ScriptResult =
  | { kind: 'os-opened'; osNumber: string }
  | { kind: 'os-not-opened' }
  | { kind: 'fcr-registered'; fcrNumber: string };
