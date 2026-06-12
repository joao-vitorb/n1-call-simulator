export type SatStepStatus = 'pass' | 'fail' | 'skipped';

export type SatStep = {
  procedure: string;
  result: string;
  status: SatStepStatus;
  log: string;
};

export type SatDevice = 'PE' | 'Switch' | 'CPE';

export type SatSection = {
  device: SatDevice;
  title: string;
  deviceName: string;
  steps: SatStep[];
};

export type SatTestRun = {
  hasFailure: boolean;
  failureMessage: string | null;
  sections: SatSection[];
};
