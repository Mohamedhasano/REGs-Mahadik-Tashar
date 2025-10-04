import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBinanceMarket } from "@/hooks/useBinanceMarket";

interface OrderBookProps { symbol: string }

type Level = { price: number; size: number };

function genBook(symbol: string) {
  const base = { BTC: 68000, ETH: 3000, GLNS: 2.4, Airland: 0.8, Regs: 3, Falconbay: 1.0, Freet: 0.4 } as Record<string, number>;
  const mid = base[symbol] ?? 100;
  const asks: Level[] = []; // higher prices
  const bids: Level[] = []; // lower prices
  for (let i = 10; i >= 1; i--) {
    asks.push({ price: +(mid + i * (mid * 0.0008)).toFixed(4), size: +(Math.random() * 5).toFixed(3) });
  }
  for (let i = 1; i <= 10; i++) {
    bids.push({ price: +(mid - i * (mid * 0.0008)).toFixed(4), size: +(Math.random() * 5).toFixed(3) });
  }
  return { asks, bids };
}

const Row = ({ level, pct, side }: { level: Level; pct: number; side: "ask" | "bid" }) => (
  <div className="relative grid grid-cols-3 text-sm py-1">
    <div
      className="absolute inset-0"
      style={{
        background:
          side === "ask"
            ? `linear-gradient(to left, hsl(var(--destructive) / 0.12) ${pct}%, transparent ${pct}%)`
            : `linear-gradient(to right, hsl(var(--accent) / 0.12) ${pct}%, transparent ${pct}%)`,
      }}
    />
    <div className={side === "ask" ? "text-[hsl(var(--destructive))]" : "text-[hsl(var(--accent))]"}>
      {level.price.toLocaleString()}
    </div>
    <div className="text-right text-muted-foreground">{level.size}</div>
    <div className="text-right text-muted-foreground">{(level.price * level.size).toLocaleString()}</div>
  </div>
);

const OrderBook = ({ symbol }: OrderBookProps) => {
  const live = useBinanceMarket(symbol);
  const fallback = genBook(symbol);
  const asks = live.asks.length ? live.asks : fallback.asks;
  const bids = live.bids.length ? live.bids : fallback.bids;
  const maxSize = Math.max(...asks.map((l) => l.size), ...bids.map((l) => l.size), 1);

  return (
    <Card className="card-elevated h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Order Book</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 text-xs text-muted-foreground pb-1">
          <div>Price (USDT)</div>
          <div className="text-right">Size</div>
          <div className="text-right">Total</div>
        </div>

        <div className="divide-y">
          {/* Asks */}
          {asks.map((l, i) => (
            <Row key={`a-${i}`} level={l} pct={(l.size / maxSize) * 100} side="ask" />
          ))}
        </div>

        <div className="my-2 text-center text-xs text-muted-foreground">Spread</div>

        <div className="divide-y">
          {/* Bids */}
          {bids.map((l, i) => (
            <Row key={`b-${i}`} level={l} pct={(l.size / maxSize) * 100} side="bid" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBook;
