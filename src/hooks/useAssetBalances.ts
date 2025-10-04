import * as React from "react";

export interface AssetBalance {
  symbol: string;
  amount: number;
  priceUSD: number;
  live?: boolean;
}

interface State {
  balances: AssetBalance[];
}

const STORAGE_KEY = "asset-balances";

const listeners: Array<(state: State) => void> = [];

// Initial balances
const initialBalances: AssetBalance[] = [
  { symbol: "BTC", amount: 0.25, priceUSD: 0, live: true },
  { symbol: "ETH", amount: 2.5, priceUSD: 0, live: true },
  { symbol: "REGS", amount: 1000, priceUSD: 1, live: false },
  { symbol: "GLNS", amount: 1500, priceUSD: 0.12, live: false },
  { symbol: "Airland", amount: 8000, priceUSD: 0.05, live: false },
];

let memoryState: State = { balances: [] };

function loadFromStorage(): AssetBalance[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialBalances;
    const parsed = JSON.parse(raw) as AssetBalance[];
    return Array.isArray(parsed) ? parsed : initialBalances;
  } catch {
    return initialBalances;
  }
}

function saveToStorage(balances: AssetBalance[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(balances));
  } catch {}
}

function emit() {
  listeners.forEach((l) => l(memoryState));
}

export function updateAssetBalance(symbol: string, newAmount: number) {
  const updatedBalances = memoryState.balances.map(balance =>
    balance.symbol === symbol 
      ? { ...balance, amount: Math.max(0, newAmount) } // Prevent negative balances
      : balance
  );
  memoryState = { balances: updatedBalances };
  saveToStorage(updatedBalances);
  emit();
}

export function subtractFromBalance(symbol: string, amount: number) {
  const currentBalance = memoryState.balances.find(b => b.symbol === symbol);
  if (currentBalance && currentBalance.amount >= amount) {
    updateAssetBalance(symbol, currentBalance.amount - amount);
    return true;
  }
  return false;
}

export function addToBalance(symbol: string, amount: number) {
  const currentBalance = memoryState.balances.find(b => b.symbol === symbol);
  if (currentBalance) {
    updateAssetBalance(symbol, currentBalance.amount + amount);
  }
}

export function updateAssetPrice(symbol: string, priceUSD: number) {
  const updatedBalances = memoryState.balances.map(balance =>
    balance.symbol === symbol 
      ? { ...balance, priceUSD }
      : balance
  );
  memoryState = { balances: updatedBalances };
  saveToStorage(updatedBalances);
  emit();
}

export function useAssetBalances() {
  const [state, setState] = React.useState<State>(() => ({ balances: loadFromStorage() }));

  React.useEffect(() => {
    // Hydrate memory on first mount
    if (memoryState.balances.length === 0) {
      memoryState = { balances: state.balances };
    }
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return {
    balances: state.balances,
    updateBalance: updateAssetBalance,
    subtractFromBalance,
    addToBalance,
    updatePrice: updateAssetPrice,
  };
}