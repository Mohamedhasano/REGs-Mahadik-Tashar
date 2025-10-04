import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useBinanceTicker } from "@/hooks/useBinanceTicker";
import CandlestickChart from "./CandlestickChart";

interface PriceChartProps {
  symbol: string;
}

type Point = { t: string; p: number };

function generateSeries(symbol: string): Point[] {
  // Simple deterministic mock series based on symbol string
  const base = {
    BTC: 68000,
    ETH: 3000,
    GLNS: 2.4,
    Airland: 0.8,
    Regs: 3,
    Falconbay: 1.0,
    Freet: 0.4,
  } as Record<string, number>;
  const start = base[symbol] ?? 100;
  const data: Point[] = [];
  let price = start;
  for (let i = 0; i < 60; i++) {
    const noise = Math.sin(i / 5 + symbol.length) * (start * 0.001) + (Math.random() - 0.5) * (start * 0.0008);
    price = Math.max(0.0001, price + noise);
    data.push({ t: `${i}`, p: Number(price.toFixed(4)) });
  }
  return data;
}

const PriceChart = ({ symbol }: PriceChartProps) => {
  const [chartMode, setChartMode] = useState("advanced");
  const data = generateSeries(symbol);
  const { enabled, lastPrice } = useBinanceTicker(symbol);
  const livePrice = enabled && lastPrice ? lastPrice : undefined;

  if (chartMode === "advanced") {
    return <CandlestickChart symbol={symbol} />;
  }

  return (
    <Card className="card-elevated h-full">
      <CardHeader className="py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {symbol}/USDT Chart{livePrice ? ` — ${livePrice.toLocaleString()}` : ""}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={chartMode === "simple" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartMode("simple")}
            >
              Simple
            </Button>
            <Button
              variant={chartMode === "advanced" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartMode("advanced")}
            >
              Advanced
            </Button>
          </div>
        </div>
        <meta itemProp="price" content={String(livePrice ?? data[data.length-1]?.p ?? "")} />
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 6, right: 6, top: 6, bottom: 6 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
            <XAxis dataKey="t" hide tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground) / 0.6)" width={60} />
            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                     labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                     formatter={(v: any) => [v, `${symbol}/USDT`]} />
            <Area type="monotone" dataKey="p" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#priceFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PriceChart;