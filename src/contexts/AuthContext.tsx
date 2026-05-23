import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types/user';

const STORAGE_KEY = 'n1_current_user';

const PERSISTENT_KEYS = [
  'n1_client_hub_generated_protocols',
  'n1_client_hub_interactions',
  'n1_created_orders',
];

type AuthContextValue = {
  currentUser: User | null;
  login: (username: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): User | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

function clearOtherSessionState() {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (
      key &&
      key.startsWith('n1_') &&
      key !== STORAGE_KEY &&
      !PERSISTENT_KEYS.includes(key)
    ) {
      keysToRemove.push(key);
    }
  }
  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => readStoredUser());

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  function login(username: string) {
    const newUser: User = {
      username,
      loggedAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
  }

  function logout() {
    clearOtherSessionState();
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
