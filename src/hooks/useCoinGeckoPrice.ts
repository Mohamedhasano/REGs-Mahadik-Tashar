import { useEffect, useRef, useState } from "react";

// Map common symbols to CoinGecko IDs
const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
  SOL: "solana",
  XRP: "ripple",
  DOGE: "dogecoin",
};

export function useCoinGeckoPrice(symbol: string) {
  const id = COINGECKO_IDS[symbol.toUpperCase()];
  const [priceUsd, setPriceUsd] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!id) {
      setPriceUsd(undefined);
      return;
    }

    const controller = new AbortController();
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=usd`;
        const res = await fetch(url, { signal: controller.signal, headers: { 'accept': 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const p = data?.[id]?.usd;
        if (typeof p === "number" && !Number.isNaN(p)) setPriceUsd(p);
      } catch (e) {
        // ignore errors, keep previous price
      } finally {
        setLoading(false);
      }
    };

    // initial fetch
    fetchPrice();
    // poll every 20s
    intervalRef.current = window.setInterval(fetchPrice, 20000);

    return () => {
      controller.abort();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [id]);

  return { priceUsd, loading };
}
