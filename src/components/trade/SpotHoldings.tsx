import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSpotHistory } from "@/hooks/useSpotHistory";

interface Holding {
  id: string;
  symbol: string;
  quote: string;
  amount: number;
  avgPrice: number; // in quote currency
  totalCost: number;
  lastBuyAt: number;
}

export default function SpotHoldings() {
  const { orders } = useSpotHistory();

  const holdings = useMemo(() => {
    const map = new Map<string, Holding>();
    for (const o of orders) {
      if (o.side !== "buy") continue; // only buys count toward holdings per user request
      const key = `${o.symbol}-${o.quote}`;
      const current = map.get(key) || {
        id: key,
        symbol: o.symbol,
        quote: o.quote,
        amount: 0,
        avgPrice: 0,
        totalCost: 0,
        lastBuyAt: 0,
      };
      current.amount += o.amount;
      current.totalCost += o.price * o.amount;
      current.avgPrice = current.amount > 0 ? current.totalCost / current.amount : 0;
      current.lastBuyAt = Math.max(current.lastBuyAt, o.timestamp);
      map.set(key, current);
    }
    return Array.from(map.values()).sort((a, b) => b.lastBuyAt - a.lastBuyAt);
  }, [orders]);

  const fmt = (n: number, max = 8) => n.toLocaleString(undefined, { maximumFractionDigits: max });

  if (holdings.length === 0) {
    return (
      <Card className="card-elevated">
        <CardHeader className="py-4">
          <CardTitle className="text-lg">Spot Holdings</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-muted-foreground">
          No holdings yet. Place a Buy order to populate this list.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elevated">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Spot Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Avg Cost</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
                <TableHead>Quote</TableHead>
                <TableHead>Last Buy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{h.symbol}</TableCell>
                  <TableCell className="text-right">{fmt(h.amount)}</TableCell>
                  <TableCell className="text-right">{fmt(h.avgPrice)} {h.quote}</TableCell>
                  <TableCell className="text-right">{fmt(h.totalCost)} {h.quote}</TableCell>
                  <TableCell>{h.quote}</TableCell>
                  <TableCell>{new Date(h.lastBuyAt).toLocaleTimeString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
