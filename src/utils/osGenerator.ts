export function generateOsNumber(): string {
  let suffix = '';
  for (let i = 0; i < 7; i += 1) {
    suffix += Math.floor(Math.random() * 10).toString();
  }
  return `003${suffix}`;
}
