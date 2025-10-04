import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";

interface SelectCoinSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCoin?: (symbol: string) => void;
}

const coins = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "USDT", name: "TetherUS" },
  { symbol: "BNB", name: "BNB" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "REGS", name: "REGS" },
];

const CoinRow = ({ symbol, name, onClick }: { symbol: string; name: string; onClick: () => void }) => (
  <button
    className="w-full flex items-center gap-3 px-2 py-3 rounded-md hover:bg-accent transition-colors text-left"
    onClick={onClick}
    aria-label={`Select ${symbol}`}
  >
    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
      {symbol.substring(0, 3)}
    </div>
    <div className="flex-1">
      <div className="text-sm font-medium">{symbol}</div>
      <div className="text-xs text-muted-foreground">{name}</div>
    </div>
  </button>
);

export default function SelectCoinSheet({ open, onOpenChange, onSelectCoin }: SelectCoinSheetProps) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return coins;
    return coins.filter((c) => c.symbol.toLowerCase().includes(t) || c.name.toLowerCase().includes(t));
  }, [q]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-4 pb-6 max-h-[80vh]">
        <SheetHeader>
          <SheetTitle>Select Coin</SheetTitle>
        </SheetHeader>
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search coins"
            aria-label="Search coins"
            className="pl-9"
          />
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <div className="text-xs font-medium text-foreground/80 mb-2">History</div>
            <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs">USDT</div>
          </div>
          <div>
            <div className="text-xs font-medium text-foreground/80 mb-2">Trending</div>
            <ScrollArea className="max-h-[46vh] pr-2">
              <div className="divide-y">
                {filtered.map((c) => (
                  <CoinRow key={c.symbol} symbol={c.symbol} name={c.name} onClick={() => onSelectCoin?.(c.symbol)} />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
