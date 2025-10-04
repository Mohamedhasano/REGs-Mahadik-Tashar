import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ArrowUpDown, Repeat } from "lucide-react";

interface SwapSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SwapSheet({ open, onOpenChange }: SwapSheetProps) {
  const [fromAsset, setFromAsset] = useState("BTC");
  const [toAsset, setToAsset] = useState("ETH");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const assets = [
    { symbol: "BTC", name: "Bitcoin", balance: "0.5432" },
    { symbol: "ETH", name: "Ethereum", balance: "12.345" },
    { symbol: "SOL", name: "Solana", balance: "100.0" },
    { symbol: "REGS", name: "REGS Token", balance: "1000.0" },
    { symbol: "USDT", name: "Tether", balance: "5000.0" },
  ];

  const handleSwapAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const estimatedRate = "1 BTC = 19.45 ETH";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            Swap Assets
          </SheetTitle>
          <SheetDescription>
            Exchange one cryptocurrency for another
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>From</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Asset</Label>
                <Select value={fromAsset} onValueChange={setFromAsset}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset.symbol} value={asset.symbol}>
                        <div className="flex justify-between w-full">
                          <span>{asset.symbol} - {asset.name}</span>
                          <span className="text-muted-foreground ml-2">
                            Balance: {asset.balance}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                />
                <div className="text-sm text-muted-foreground">
                  Available: {assets.find(a => a.symbol === fromAsset)?.balance} {fromAsset}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapAssets}
              className="rounded-full"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>To</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Asset</Label>
                <Select value={toAsset} onValueChange={setToAsset}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset.symbol} value={asset.symbol}>
                        <div className="flex justify-between w-full">
                          <span>{asset.symbol} - {asset.name}</span>
                          <span className="text-muted-foreground ml-2">
                            Balance: {asset.balance}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (Estimated)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={toAmount}
                  onChange={(e) => setToAmount(e.target.value)}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Exchange Rate:</span>
                  <span>{estimatedRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee:</span>
                  <span>0.001 {fromAsset}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span>0.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full">
            Swap {fromAsset} to {toAsset}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}