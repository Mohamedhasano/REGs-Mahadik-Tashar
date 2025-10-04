import { useEffect, useState } from "react";

export interface KlineData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

function toBinancePair(symbol: string) {
  return `${symbol.toUpperCase()}USDT`;
}

export function useBinanceKlines(symbol: string, interval: string = '1h', limit: number = 100) {
  const [klines, setKlines] = useState<KlineData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    const controller = new AbortController();

    const fetchKlines = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const pair = toBinancePair(symbol);
        const url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`;
        
        const response = await fetch(url, { 
          signal: controller.signal,
          headers: { 'accept': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (!aborted && Array.isArray(data)) {
          const formattedKlines: KlineData[] = data.map((kline: any[]) => ({
            time: new Date(kline[0]).toISOString(),
            open: parseFloat(kline[1]),
            high: parseFloat(kline[2]),
            low: parseFloat(kline[3]),
            close: parseFloat(kline[4]),
            volume: parseFloat(kline[5])
          }));
          
          setKlines(formattedKlines);
        }
      } catch (err) {
        if (!aborted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch klines');
          console.error('Failed to fetch klines:', err);
        }
      } finally {
        if (!aborted) {
          setLoading(false);
        }
      }
    };

    fetchKlines();
    
    // Refresh data every 30 seconds
    const intervalId = setInterval(fetchKlines, 30000);

    return () => {
      aborted = true;
      controller.abort();
      clearInterval(intervalId);
    };
  }, [symbol, interval, limit]);

  return { klines, loading, error };
}