import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Coins, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WalletPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createOnOpen?: boolean;
}

export default function WalletPanel({ open, onOpenChange, createOnOpen = false }: WalletPanelProps) {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);

  const handleWalletClick = () => {
    if (hasWallet || creating) return;
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      setHasWallet(true);
    }, 1000);
  };

  useEffect(() => {
    if (open && createOnOpen && !hasWallet && !creating) {
      setCreating(true);
      const t = setTimeout(() => {
        setCreating(false);
        setHasWallet(true);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [open, createOnOpen, hasWallet, creating]);

  const assets = [
    { symbol: "USDT", amount: 250.32, fiat: 250.32 },
    { symbol: "BTC", amount: 0.0123, fiat: 840.5 },
    { symbol: "ETH", amount: 0.45, fiat: 1420.12 },
    { symbol: "REGS", amount: 120, fiat: 2400 },
  ];

  const total = assets.reduce((s, a) => s + a.fiat, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle
            onClick={handleWalletClick}
            className="cursor-pointer select-none hover-scale"
            role="button"
            tabIndex={0}
            aria-busy={creating}
            aria-label="Wallet title - click to create wallet"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleWalletClick(); } }}
          >
            Wallet
          </SheetTitle>
          <SheetDescription>View balances and quick actions.</SheetDescription>
        </SheetHeader>

        <div className="p-4 space-y-3 border-b bg-muted/50">
          {creating && (
            <Card className="shadow-none animate-enter">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" aria-hidden />
                <div>
                  <div className="text-sm font-medium">Creating wallet…</div>
                  <div className="text-xs text-muted-foreground">Please wait a moment</div>
                </div>
              </CardContent>
            </Card>
          )}

          {hasWallet && !creating && (
            <Card className="shadow-none animate-enter">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Wallet Name</div>
                  <div className="mt-1 text-lg font-semibold">REGS</div>
                </div>
                <Badge className="pulse">REGS</Badge>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Total Balance</div>
                <div className="mt-1 text-2xl font-semibold">${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
              <Coins className="h-6 w-6 text-muted-foreground" />
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => navigate("/assets")}>
              <ArrowDownToLine className="h-4 w-4 mr-2" /> Deposit
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => navigate("/assets")}>
              <ArrowUpFromLine className="h-4 w-4 mr-2" /> Withdraw
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {assets.map((a) => (
              <Card key={a.symbol} className="shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{a.symbol}</span>
                      {a.symbol === "USDT" && (
                        <Badge variant="secondary">P2P USDT/PKR</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{a.amount} {a.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${a.fiat.toLocaleString()}</div>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => navigate("/markets")}>Market</Button>
                      <Button size="sm" onClick={() => navigate("/trade")}>Trade</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
