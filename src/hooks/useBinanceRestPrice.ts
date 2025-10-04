import { useEffect, useRef, useState } from "react";

function toBinancePair(symbol: string) {
  return `${symbol.toUpperCase()}USDT`;
}

export function useBinanceRestPrice(symbol: string, intervalMs = 15000) {
  const pair = toBinancePair(symbol);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    let aborted = false;
    const controller = new AbortController();

    const fetchPrice = async () => {
      try {
        setLoading(true);
        const url = `https://api.binance.com/api/v3/ticker/price?symbol=${encodeURIComponent(pair)}`;
        const res = await fetch(url, { signal: controller.signal, headers: { 'accept': 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const p = parseFloat(data?.price);
        if (!aborted && !Number.isNaN(p)) setPrice(p);
      } catch {
        // ignore network errors, keep last price
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    fetchPrice();
    intervalRef.current = window.setInterval(fetchPrice, intervalMs);

    return () => {
      aborted = true;
      controller.abort();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pair, intervalMs]);

  return { price, loading };
}
