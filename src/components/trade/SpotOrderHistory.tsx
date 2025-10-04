import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSpotHistory } from "@/hooks/useSpotHistory";

export default function SpotOrderHistory() {
  const { orders, clear } = useSpotHistory();

  return (
    <Card className="card-elevated">
      <CardHeader className="py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Spot Order History</CardTitle>
        {orders.length > 0 && (
          <Button variant="outline" size="sm" onClick={clear}>Clear</Button>
        )}
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No recent spot orders</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Quote</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{new Date(o.timestamp).toLocaleTimeString()}</TableCell>
                    <TableCell>{o.symbol}</TableCell>
                    <TableCell className={o.side === "buy" ? "text-[hsl(var(--accent))]" : "text-destructive"}>
                      {o.side.toUpperCase()}
                    </TableCell>
                    <TableCell className="text-right">{o.price}</TableCell>
                    <TableCell className="text-right">{o.amount}</TableCell>
                    <TableCell>{o.quote}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
