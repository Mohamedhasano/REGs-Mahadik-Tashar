import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useBinanceTicker } from "@/hooks/useBinanceTicker";
import { addSpotOrder } from "@/hooks/useSpotHistory";

interface OrderFormProps { symbol: string }

type Side = "buy" | "sell";

const OrderForm = ({ symbol }: OrderFormProps) => {
  const [quote, setQuote] = useState<"USDT" | "BTC" | "ETH" | "PKR">("USDT");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");

  const { lastPrice } = useBinanceTicker(symbol);
  useEffect(() => {
    if (quote === "USDT" && lastPrice && price === "") {
      setPrice(String(+lastPrice.toFixed(4)));
    }
  }, [lastPrice, price, quote]);

  const submit = (side: Side) => {
    if (!price || !size) {
      toast.error("Enter price and size");
      return;
    }
    // Instant preview toast
    toast.success("Order preview", { description: `${side === "buy" ? "Buy" : "Sell"} ${size} ${symbol} @ ${price} ${quote}`, duration: 1200 });

    // Save BUY orders to spot history automatically
    if (side === "buy") {
      const p = Number(price);
      const amt = Number(size);
      if (!Number.isNaN(p) && !Number.isNaN(amt)) {
        addSpotOrder({ symbol, side: "buy", price: p, amount: amt, quote });
      }
    }

    setSize("");
  };

  return (
    <Card className="card-elevated">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Order</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          <div className="mt-3">
            <label className="text-sm text-muted-foreground">Quote currency</label>
            <Select value={quote} onValueChange={(v) => setQuote(v as "USDT" | "BTC" | "ETH" | "PKR")}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select quote" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="PKR">PKR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="buy" className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground">Price ({quote})</label>
              <Input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Amount ({symbol})</label>
              <Input inputMode="decimal" value={size} onChange={(e) => setSize(e.target.value)} placeholder="0.0000" />
            </div>
            <Button onClick={() => submit("buy")} className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:opacity-90">Buy {symbol}</Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground">Price ({quote})</label>
              <Input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Amount ({symbol})</label>
              <Input inputMode="decimal" value={size} onChange={(e) => setSize(e.target.value)} placeholder="0.0000" />
            </div>
            <Button variant="destructive" onClick={() => submit("sell")} className="w-full">Sell {symbol}</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
