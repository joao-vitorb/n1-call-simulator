export type SacAttendant = {
  name: string;
  extension: string;
};

export const SAC_NUMBER = '3002';

export const SAC_ATTENDANTS: SacAttendant[] = [
  { name: 'Camila Andrade', extension: '4101' },
  { name: 'Beatriz Nogueira', extension: '4102' },
  { name: 'Larissa Souza', extension: '4103' },
  { name: 'Fernanda Costa', extension: '4104' },
  { name: 'Juliana Martins', extension: '4105' },
  { name: 'Patrícia Rocha', extension: '4106' },
];

export function pickSacAttendant(): SacAttendant {
  return SAC_ATTENDANTS[Math.floor(Math.random() * SAC_ATTENDANTS.length)];
}
