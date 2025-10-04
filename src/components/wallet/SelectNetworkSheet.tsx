import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronRight } from "lucide-react";
import React from "react";

interface SelectNetworkSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coinSymbol: string;
  onSelectNetwork?: (networkId: string) => void;
}

type Network = {
  id: string;
  name: string;
  confirmations: number | string;
  minDeposit: string;
  estArrival: string;
};

const getNetworksForCoin = (symbol: string): Network[] => {
  const sym = symbol.toUpperCase();
  if (sym === "BTC") {
    return [
      { id: "btc-segwit", name: "BTC(SegWit)", confirmations: 1, minDeposit: ">0.000006 BTC", estArrival: "≈ 1 mins" },
      { id: "bitcoin", name: "Bitcoin", confirmations: 1, minDeposit: ">0.00001 BTC", estArrival: "≈ 1 mins" },
      { id: "bep20", name: "BNB Smart Chain (BEP20)", confirmations: 5, minDeposit: ">0.00000002 BTC", estArrival: "≈ 1 mins" },
      { id: "lightning", name: "Lightning Network", confirmations: 1, minDeposit: ">0.00001999 BTC", estArrival: "≈ 1 mins" },
      { id: "erc20", name: "Ethereum (ERC20)", confirmations: 6, minDeposit: ">0.00000002 BTC", estArrival: "≈ 2 mins" },
    ];
  }
  // Minimal defaults for other coins; can be expanded later
  return [
    { id: `${sym}-erc20`, name: "Ethereum (ERC20)", confirmations: 6, minDeposit: `>0.0001 ${sym}`, estArrival: "≈ 2 mins" },
    { id: `${sym}-bep20`, name: "BNB Smart Chain (BEP20)", confirmations: 5, minDeposit: `>0.0001 ${sym}`, estArrival: "≈ 1 mins" },
  ];
};

const NetworkRow = ({ network, onClick }: { network: Network; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full rounded-xl border bg-background p-4 text-left hover:bg-accent transition-colors flex items-start gap-3"
    aria-label={`Select ${network.name}`}
  >
    <div className="flex-1">
      <div className="text-base font-semibold leading-none mb-1">{network.name}</div>
      <div className="space-y-0.5 text-xs text-muted-foreground">
        <div>{network.confirmations} block confirmation/s</div>
        <div>Min. deposit {network.minDeposit}</div>
        <div>Est. arrival {network.estArrival}</div>
      </div>
    </div>
    <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5" />
  </button>
);

export default function SelectNetworkSheet({ open, onOpenChange, coinSymbol, onSelectNetwork }: SelectNetworkSheetProps) {
  const networks = React.useMemo(() => getNetworksForCoin(coinSymbol), [coinSymbol]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-4 pb-6 max-h-[80vh]">
        <SheetHeader className="mb-2">
          <SheetTitle>Choose Network</SheetTitle>
          <p className="text-xs text-muted-foreground">Deposit {coinSymbol}</p>
        </SheetHeader>
        <ScrollArea className="max-h-[56vh] pr-1">
          <div className="space-y-3">
            {networks.map((n) => (
              <NetworkRow key={n.id} network={n} onClick={() => onSelectNetwork?.(n.id)} />
            ))}
          </div>
          <div className="mt-4 rounded-xl border bg-muted/40 p-3 text-xs text-muted-foreground flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <p>
              Please note that only supported networks on this platform are shown. If you deposit via another network your assets may be lost.
            </p>
          </div>
        </ScrollArea>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
