import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { TrendingUp, ArrowUpDown } from "lucide-react";

interface TradeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TradeSheet({ open, onOpenChange }: TradeSheetProps) {
  const [orderType, setOrderType] = useState("market");
  const [side, setSide] = useState("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");

  const tradingPairs = [
    { symbol: "BTCUSDT", price: "67,234.50" },
    { symbol: "ETHUSDT", price: "3,456.78" },
    { symbol: "SOLUSDT", price: "234.56" },
    { symbol: "REGSUSDT", price: "1.00" },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Futures Trading
          </SheetTitle>
          <SheetDescription>
            Trade futures contracts with leverage
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Trading Pair</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {tradingPairs.map((pair) => (
                  <Button
                    key={pair.symbol}
                    variant="outline"
                    className="flex justify-between p-4 h-auto"
                  >
                    <span className="font-medium">{pair.symbol}</span>
                    <span className="text-green-600">${pair.price}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order Type</Label>
                  <Select value={orderType} onValueChange={setOrderType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="limit">Limit</SelectItem>
                      <SelectItem value="stop">Stop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Side</Label>
                  <Select value={side} onValueChange={setSide}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy/Long</SelectItem>
                      <SelectItem value="sell">Sell/Short</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {orderType === "limit" && (
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              )}

              <Button 
                className={`w-full ${side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {side === 'buy' ? 'Buy/Long' : 'Sell/Short'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}