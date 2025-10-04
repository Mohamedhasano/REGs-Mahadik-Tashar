import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, ChevronDown, RefreshCw, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import React from "react";

interface DepositAddressSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coinSymbol: string;
  networkId: string;
}

type Network = { id: string; name: string };

const getNetworksForCoin = (symbol: string): Network[] => {
  const sym = symbol.toUpperCase();
  if (sym === "BTC") {
    return [
      { id: "btc-segwit", name: "BTC(SegWit)" },
      { id: "bitcoin", name: "Bitcoin" },
      { id: "bep20", name: "BNB Smart Chain (BEP20)" },
      { id: "lightning", name: "Lightning Network" },
      { id: "erc20", name: "Ethereum (ERC20)" },
    ];
  }
  return [
    { id: `${sym}-erc20`, name: "Ethereum (ERC20)" },
    { id: `${sym}-bep20`, name: "BNB Smart Chain (BEP20)" },
  ];
};

const generateOrGetAddress = (coin: string, networkId: string) => {
  const key = `deposit_addr:${coin.toUpperCase()}:${networkId}`;
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const rand = (len: number) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz23456789';
    let out = '';
    const buf = new Uint32Array(len);
    crypto.getRandomValues(buf);
    for (let i = 0; i < len; i++) out += chars[buf[i] % chars.length];
    return out;
  };
  const hex = (len: number) => {
    const bytes = new Uint8Array(len / 2);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  };
  const bech32 = (prefix: string, len: number) => `${prefix}${rand(len)}`;
  const base58 = (len: number) => {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let out = '';
    const buf = new Uint32Array(len);
    crypto.getRandomValues(buf);
    for (let i = 0; i < len; i++) out += chars[buf[i] % chars.length];
    return out;
  };

  const isEVM = networkId === 'erc20' || networkId === 'bep20' || networkId.endsWith('-erc20') || networkId.endsWith('-bep20');
  let addr: string;
  if (isEVM) addr = `0x${hex(40)}`;
  else if (networkId === 'btc-segwit') addr = bech32('bc1q', 38);
  else if (networkId === 'lightning') addr = bech32('lnbc1p', 42);
  else if (coin.toUpperCase() === 'BTC') addr = `1${base58(33)}`;
  else addr = bech32(`${coin.toLowerCase()}1`, 30);

  localStorage.setItem(key, addr);
  return addr;
};

export default function DepositAddressSheet({ open, onOpenChange, coinSymbol, networkId }: DepositAddressSheetProps) {
  const [copied, setCopied] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const networks = React.useMemo(() => getNetworksForCoin(coinSymbol), [coinSymbol]);
  const network = networks.find((n) => n.id === networkId) || { id: networkId, name: networkId };
  const address = React.useMemo(() => generateOrGetAddress(coinSymbol, networkId), [coinSymbol, networkId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const share = async () => {
    const text = `${coinSymbol} deposit address on ${network.name}: ${address}`;
    if (navigator.share) {
      try { await navigator.share({ title: `${coinSymbol} Deposit`, text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-4 pb-6 max-h-[90vh]">
        <SheetHeader className="mb-2">
          <SheetTitle>Deposit {coinSymbol}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="max-h-[70vh] pr-1">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-2xl border p-4 bg-background">
              <QRCodeSVG value={address} size={220} bgColor="transparent" />
            </div>
            <Card className="w-full rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Network</div>
                  <div className="text-sm font-medium">{network.name}</div>
                </div>
                <button className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground" aria-label="Change network">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground">Deposit Address</div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <code className="text-sm break-all">{address}</code>
                  <button onClick={handleCopy} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent" aria-label="Copy address">
                    <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
                <CollapsibleTrigger className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  More Details <ChevronDown className="h-3.5 w-3.5" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="mt-2 text-xs text-muted-foreground list-disc pl-4 space-y-1">
                    <li>Send only {coinSymbol} via {network.name} to this address.</li>
                    <li>Deposits via unsupported networks may result in loss of assets.</li>
                    <li>Confirmations required vary by network congestion.</li>
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </ScrollArea>
        <div className="mt-4">
          <Button className="w-full" onClick={share}>
            <Share2 className="h-4 w-4 mr-2" /> Save and Share Address
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
