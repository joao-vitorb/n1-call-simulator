export function generateProtocol(): string {
  let suffix = '';
  for (let i = 0; i < 8; i += 1) {
    suffix += Math.floor(Math.random() * 10).toString();
  }
  return `2026${suffix}`;
}
