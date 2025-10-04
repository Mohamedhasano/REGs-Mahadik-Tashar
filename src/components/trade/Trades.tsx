import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBinanceMarket } from "@/hooks/useBinanceMarket";

interface TradesProps { symbol: string }

type Trade = { time: string; price: number; size: number; side: "buy" | "sell" };

function genTrades(symbol: string): Trade[] {
  const base = { BTC: 68000, ETH: 3000, GLNS: 2.4, Airland: 0.8, Regs: 3, Falconbay: 1.0, Freet: 0.4 } as Record<string, number>;
  const mid = base[symbol] ?? 100;
  const arr: Trade[] = [];
  for (let i = 0; i < 20; i++) {
    const side = Math.random() > 0.5 ? "buy" : "sell";
    const price = mid + (Math.random() - 0.5) * (mid * 0.002);
    const size = Math.random() * 3;
    arr.push({
      time: new Date(Date.now() - i * 1000 * 12).toLocaleTimeString(),
      price: +price.toFixed(4),
      size: +size.toFixed(3),
      side,
    });
  }
  return arr;
}
const Trades = ({ symbol }: TradesProps) => {
  const live = useBinanceMarket(symbol);
  const trades = live.trades.length ? live.trades : genTrades(symbol);
  return (
    <Card className="card-elevated h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Recent Trades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 text-xs text-muted-foreground pb-1">
          <div>Time</div>
          <div className="text-right">Price</div>
          <div className="text-right">Size</div>
        </div>
        <div className="divide-y">
          {trades.map((t, i) => (
            <div key={i} className="grid grid-cols-3 text-sm py-1">
              <div className="truncate">{t.time}</div>
              <div className={"text-right " + (t.side === "buy" ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--destructive))]")}>{t.price.toLocaleString()}</div>
              <div className="text-right text-muted-foreground">{t.size}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Trades;
