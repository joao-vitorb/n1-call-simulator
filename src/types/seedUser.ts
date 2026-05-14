export type SeedUserRole = 'Trainee' | 'Supervisor';

export type SeedUser = {
  id: string;
  name: string;
  extension: string;
  role: SeedUserRole;
};
