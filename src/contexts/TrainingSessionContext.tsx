import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ActiveCall, FinishedCall } from '../types/trainingCall';

type TrainingSessionValue = {
  onlineSince: string;
  activeCall: ActiveCall | null;
  finishedCalls: FinishedCall[];
  receiveCall: (phoneNumber: string) => void;
  hangUp: () => void;
};

const TrainingSessionContext = createContext<TrainingSessionValue | undefined>(undefined);

export function TrainingSessionProvider({ children }: { children: ReactNode }) {
  const [onlineSince] = useState(() => new Date().toISOString());
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [finishedCalls, setFinishedCalls] = useState<FinishedCall[]>([]);

  function receiveCall(phoneNumber: string) {
    setActiveCall({
      phoneNumber,
      startedAt: new Date().toISOString(),
    });
  }

  function hangUp() {
    setActiveCall((current) => {
      if (!current) return null;
      const finishedAt = new Date().toISOString();
      const durationSeconds = Math.floor(
        (new Date(finishedAt).getTime() - new Date(current.startedAt).getTime()) / 1000,
      );
      setFinishedCalls((prev) => [
        ...prev,
        {
          phoneNumber: current.phoneNumber,
          startedAt: current.startedAt,
          finishedAt,
          durationSeconds,
        },
      ]);
      return null;
    });
  }

  return (
    <TrainingSessionContext.Provider
      value={{ onlineSince, activeCall, finishedCalls, receiveCall, hangUp }}
    >
      {children}
    </TrainingSessionContext.Provider>
  );
}

export function useTrainingSession() {
  const context = useContext(TrainingSessionContext);
  if (!context) {
    throw new Error('useTrainingSession must be used inside TrainingSessionProvider');
  }
  return context;
}
