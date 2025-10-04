import * as React from "react";

export type TransactionType = "send" | "receive" | "deposit" | "withdraw";

export interface AssetTransaction {
  id: string;
  type: TransactionType;
  asset: string;
  amount: number;
  recipient?: string;
  sender?: string;
  networkFee: number;
  platformFee: number;
  memo?: string;
  timestamp: number;
  status: "pending" | "completed" | "failed";
}

interface State {
  transactions: AssetTransaction[];
}

const STORAGE_KEY = "asset-transactions";
const MAX_TRANSACTIONS = 200;

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { transactions: [] };

function loadFromStorage(): AssetTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AssetTransaction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(transactions: AssetTransaction[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {}
}

function emit() {
  listeners.forEach((l) => l(memoryState));
}

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function addAssetTransaction(input: Omit<AssetTransaction, "id" | "timestamp" | "status"> & { 
  timestamp?: number;
  status?: "pending" | "completed" | "failed";
}) {
  const transaction: AssetTransaction = {
    id: genId(),
    timestamp: input.timestamp ?? Date.now(),
    status: input.status ?? "completed",
    ...input,
  };
  const next = [transaction, ...memoryState.transactions].slice(0, MAX_TRANSACTIONS);
  memoryState = { transactions: next };
  saveToStorage(next);
  emit();
  return transaction.id;
}

export function clearAssetHistory() {
  memoryState = { transactions: [] };
  saveToStorage([]);
  emit();
}

export function useAssetHistory() {
  const [state, setState] = React.useState<State>(() => ({ transactions: loadFromStorage() }));

  React.useEffect(() => {
    // Hydrate memory on first mount
    if (memoryState.transactions.length === 0) {
      memoryState = { transactions: state.transactions };
    }
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return {
    transactions: state.transactions,
    clear: clearAssetHistory,
  };
}