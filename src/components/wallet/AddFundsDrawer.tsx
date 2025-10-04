import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDownToLine, QrCode, Landmark, Users, ChevronRight } from "lucide-react";
import * as React from "react";

interface AddFundsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (method: "onchain" | "regspay" | "fiat" | "p2p") => void;
}

const Row = ({
  icon: Icon,
  title,
  desc,
  onClick,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full rounded-xl border bg-background text-left p-4 flex items-center gap-3 hover:bg-accent transition-colors",
      className
    )}
    aria-label={title}
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
    <ChevronRight className="h-4 w-4 text-muted-foreground" />
  </button>
);

export default function AddFundsDrawer({ open, onOpenChange, onSelect }: AddFundsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-4 pb-6 max-h-[80vh]">
        <SheetHeader className="mb-3">
          <SheetTitle>Select Deposit Method</SheetTitle>
        </SheetHeader>
        <div className="space-y-3">
          <Row
            icon={ArrowDownToLine}
            title="On-Chain Deposit"
            desc="Deposit crypto from other exchanges/wallets"
            onClick={() => onSelect?.("onchain")}
          />
          <Row
            icon={QrCode}
            title="Receive via Regs Pay"
            desc="Receive crypto from other Regs users instantly"
            onClick={() => onSelect?.("regspay")}
          />
          <Row
            icon={Landmark}
            title="Buy with PKR"
            desc="Buy crypto via bank transfer, card, and more"
            onClick={() => onSelect?.("fiat")}
          />
          <Row
            icon={Users}
            title="P2P Trading"
            desc="Buy directly from users with local payments"
            onClick={() => onSelect?.("p2p")}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
