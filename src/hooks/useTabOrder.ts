import { useEffect, useState } from 'react';
import { DEFAULT_TAB_ORDER, type TabId } from '../types/tab';

const STORAGE_KEY = 'n1_tab_orders';

function sanitize(order: TabId[]): TabId[] {
  const valid = order.filter(
    (id, index) => DEFAULT_TAB_ORDER.includes(id) && order.indexOf(id) === index,
  );
  for (const id of DEFAULT_TAB_ORDER) {
    if (!valid.includes(id)) valid.push(id);
  }
  return valid;
}

function readMap(): Record<string, TabId[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, TabId[]>;
  } catch {
    return {};
  }
}

function loadOrder(username: string | null): TabId[] {
  if (!username) return [...DEFAULT_TAB_ORDER];
  const stored = readMap()[username];
  return stored ? sanitize(stored) : [...DEFAULT_TAB_ORDER];
}

function saveOrder(username: string | null, order: TabId[]): void {
  if (!username) return;
  try {
    const map = readMap();
    map[username] = order;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    return;
  }
}

export function useTabOrder(username: string | null): [TabId[], (next: TabId[]) => void] {
  const [order, setOrderState] = useState<TabId[]>(() => loadOrder(username));

  useEffect(() => {
    setOrderState(loadOrder(username));
  }, [username]);

  function setOrder(next: TabId[]): void {
    const clean = sanitize(next);
    setOrderState(clean);
    saveOrder(username, clean);
  }

  return [order, setOrder];
}
