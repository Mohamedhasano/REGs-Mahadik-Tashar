import * as React from "react";

export type SpotSide = "buy" | "sell";

export interface SpotOrder {
  id: string;
  symbol: string;
  side: SpotSide;
  price: number;
  amount: number;
  quote: string; // e.g., USDT
  timestamp: number;
}

interface State {
  orders: SpotOrder[];
}

const STORAGE_KEY = "spot-orders";
const MAX_ORDERS = 200;

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { orders: [] };

function loadFromStorage(): SpotOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SpotOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(orders: SpotOrder[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {}
}

function emit() {
  listeners.forEach((l) => l(memoryState));
}

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function addSpotOrder(input: Omit<SpotOrder, "id" | "timestamp"> & { timestamp?: number }) {
  const order: SpotOrder = {
    id: genId(),
    timestamp: input.timestamp ?? Date.now(),
    ...input,
  };
  const next = [order, ...memoryState.orders].slice(0, MAX_ORDERS);
  memoryState = { orders: next };
  saveToStorage(next);
  emit();
  return order.id;
}

export function clearSpotOrders() {
  memoryState = { orders: [] };
  saveToStorage([]);
  emit();
}

export function useSpotHistory() {
  const [state, setState] = React.useState<State>(() => ({ orders: loadFromStorage() }));

  React.useEffect(() => {
    // Hydrate memory on first mount
    if (memoryState.orders.length === 0) {
      memoryState = { orders: state.orders };
    }
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return {
    orders: state.orders,
    clear: clearSpotOrders,
  };
}
