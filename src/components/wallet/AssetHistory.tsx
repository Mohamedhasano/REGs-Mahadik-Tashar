import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAssetHistory } from "@/hooks/useAssetHistory";

export default function AssetHistory() {
  const { transactions, clear } = useAssetHistory();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "send":
        return "destructive";
      case "receive":
        return "default";
      case "deposit":
        return "secondary";
      case "withdraw":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card className="card-elevated">
      <CardHeader className="py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Transaction History</CardTitle>
        {transactions.length > 0 && (
          <Button variant="outline" size="sm" onClick={clear}>Clear</Button>
        )}
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No transaction history</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Fees</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{new Date(tx.timestamp).toLocaleTimeString()}</TableCell>
                    <TableCell>
                      <Badge variant={getTypeColor(tx.type)}>
                        {tx.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{tx.asset}</TableCell>
                    <TableCell className="text-right font-mono">{tx.amount}</TableCell>
                    <TableCell className="max-w-32 truncate">
                      {tx.type === "send" && tx.recipient 
                        ? `To: ${tx.recipient.slice(0, 8)}...${tx.recipient.slice(-4)}`
                        : tx.type === "receive" && tx.sender 
                        ? `From: ${tx.sender.slice(0, 8)}...${tx.sender.slice(-4)}`
                        : tx.memo || "—"
                      }
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {(tx.networkFee + tx.platformFee).toFixed(6)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(tx.status)}>
                        {tx.status}
                      </Badge>
                    </TableCell>
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