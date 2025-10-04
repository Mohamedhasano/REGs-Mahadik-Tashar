import { useEffect, useMemo, useRef, useState } from "react";

export type Level = { price: number; size: number };
export type Trade = { time: string; price: number; size: number; side: "buy" | "sell" };

const LIVE_SYMBOLS = new Set(["BTC", "ETH"]);

function toBinancePair(symbol: string) {
  return `${symbol.toLowerCase()}usdt`;
}

export function useBinanceMarket(symbol: string) {
  const enabled = LIVE_SYMBOLS.has(symbol);
  const [connected, setConnected] = useState(false);
  const [lastPrice, setLastPrice] = useState<number | undefined>(undefined);
  const [bids, setBids] = useState<Level[]>([]);
  const [asks, setAsks] = useState<Level[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const streams = useMemo(() => {
    if (!enabled) return undefined;
    const pair = toBinancePair(symbol);
    // partial depth (top 10) + trades
    return `${pair}@depth10@100ms/${pair}@trade`;
  }, [symbol, enabled]);

  useEffect(() => {
    if (!enabled || !streams) {
      setConnected(false);
      setBids([]);
      setAsks([]);
      setTrades([]);
      setLastPrice(undefined);
      return;
    }

    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        const stream: string | undefined = msg?.stream;
        const data = msg?.data;
        if (!stream || !data) return;

        // Trade stream
        if (stream.endsWith("@trade")) {
          const p = parseFloat(data.p);
          const q = parseFloat(data.q);
          const time = new Date(data.T).toLocaleTimeString();
          const side: "buy" | "sell" = data.m ? "sell" : "buy"; // m=true => sell
          if (!Number.isNaN(p)) setLastPrice(p);
          setTrades((prev) => {
            const next: Trade[] = [{ time, price: +p.toFixed(4), size: +q.toFixed(3), side }, ...prev];
            return next.slice(0, 60);
          });
        }

        // Depth stream (partial book depth)
        if (stream.includes("@depth10@")) {
          const askLvls: Level[] = (data.asks || data.a || []).map((a: [string, string]) => ({
            price: +parseFloat(a[0]).toFixed(4),
            size: +parseFloat(a[1]).toFixed(3),
          })).filter((l: Level) => l.size > 0);
          const bidLvls: Level[] = (data.bids || data.b || []).map((b: [string, string]) => ({
            price: +parseFloat(b[0]).toFixed(4),
            size: +parseFloat(b[1]).toFixed(3),
          })).filter((l: Level) => l.size > 0);

          // Sort: asks low->high, bids high->low
          askLvls.sort((a, b) => a.price - b.price);
          bidLvls.sort((a, b) => b.price - a.price);

          setAsks(askLvls.slice(0, 10));
          setBids(bidLvls.slice(0, 10));
        }
      } catch {
        // ignore malformed
      }
    };

    return () => {
      try { ws.close(); } catch {}
      wsRef.current = null;
    };
  }, [streams, enabled]);

  return { enabled, connected, lastPrice, bids, asks, trades };
}
