import { useEffect, useMemo, useRef, useState } from "react";

const LIVE_SYMBOLS = new Set(["SOL", "BNB", "XRP", "DOGE"]);

function toBinancePair(symbol: string) {
  return `${symbol.toLowerCase()}usdt`;
}

export function useBinanceTicker(symbol: string) {
  const enabled = LIVE_SYMBOLS.has(symbol);
  const [connected, setConnected] = useState(false);
  const [lastPrice, setLastPrice] = useState<number | undefined>(undefined);
  const wsRef = useRef<WebSocket | null>(null);

  const stream = useMemo(() => {
    if (!enabled) return undefined;
    return `${toBinancePair(symbol)}@trade`;
  }, [symbol, enabled]);

  useEffect(() => {
    if (!enabled || !stream) {
      setConnected(false);
      setLastPrice(undefined);
      return;
    }

    const url = `wss://stream.binance.com:9443/ws/${stream}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        const p = parseFloat(data.p);
        if (!Number.isNaN(p)) setLastPrice(p);
      } catch {
        // ignore
      }
    };

    return () => {
      try { ws.close(); } catch {}
      wsRef.current = null;
    };
  }, [stream, enabled]);

  return { enabled, connected, lastPrice };
}
