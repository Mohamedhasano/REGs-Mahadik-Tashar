import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { ArrowRightLeft, Wallet } from "lucide-react";

interface TransferSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TransferSheet({ open, onOpenChange }: TransferSheetProps) {
  const [transferType, setTransferType] = useState("internal");
  const [fromWallet, setFromWallet] = useState("spot");
  const [toWallet, setToWallet] = useState("earn");
  const [asset, setAsset] = useState("USDT");
  const [amount, setAmount] = useState("");

  const walletTypes = [
    { value: "spot", label: "Spot Wallet", balance: "1,234.56" },
    { value: "earn", label: "Earn Wallet", balance: "345.67" },
  ];

  const assets = [
    { symbol: "USDT", name: "Tether", balance: "5000.0" },
    { symbol: "BTC", name: "Bitcoin", balance: "0.5432" },
    { symbol: "ETH", name: "Ethereum", balance: "12.345" },
    { symbol: "SOL", name: "Solana", balance: "100.0" },
    { symbol: "REGS", name: "REGS Token", balance: "1000.0" },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Transfer Assets
          </SheetTitle>
          <SheetDescription>
            Move assets between your wallets or to external addresses
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs value={transferType} onValueChange={setTransferType} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="internal">Internal Transfer</TabsTrigger>
              <TabsTrigger value="external">External Transfer</TabsTrigger>
            </TabsList>

            <TabsContent value="internal" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Between Wallets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>From Wallet</Label>
                    <Select value={fromWallet} onValueChange={setFromWallet}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {walletTypes.map((wallet) => (
                          <SelectItem key={wallet.value} value={wallet.value}>
                            <div className="flex justify-between w-full">
                              <span>{wallet.label}</span>
                              <span className="text-muted-foreground ml-2">
                                {wallet.balance} USDT
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>To Wallet</Label>
                    <Select value={toWallet} onValueChange={setToWallet}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {walletTypes.filter(w => w.value !== fromWallet).map((wallet) => (
                          <SelectItem key={wallet.value} value={wallet.value}>
                            <div className="flex justify-between w-full">
                              <span>{wallet.label}</span>
                              <span className="text-muted-foreground ml-2">
                                {wallet.balance} USDT
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Asset</Label>
                    <Select value={asset} onValueChange={setAsset}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {assets.map((asset) => (
                          <SelectItem key={asset.symbol} value={asset.symbol}>
                            <div className="flex justify-between w-full">
                              <span>{asset.symbol} - {asset.name}</span>
                              <span className="text-muted-foreground ml-2">
                                {asset.balance}
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
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <div className="text-sm text-muted-foreground">
                      Available: {assets.find(a => a.symbol === asset)?.balance} {asset}
                    </div>
                  </div>

                  <Button className="w-full">
                    Transfer {asset}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="external" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>External Transfer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>From Wallet</Label>
                    <Select value={fromWallet} onValueChange={setFromWallet}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {walletTypes.map((wallet) => (
                          <SelectItem key={wallet.value} value={wallet.value}>
                            <div className="flex justify-between w-full">
                              <span>{wallet.label}</span>
                              <span className="text-muted-foreground ml-2">
                                {wallet.balance} USDT
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Asset</Label>
                    <Select value={asset} onValueChange={setAsset}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {assets.map((asset) => (
                          <SelectItem key={asset.symbol} value={asset.symbol}>
                            <div className="flex justify-between w-full">
                              <span>{asset.symbol} - {asset.name}</span>
                              <span className="text-muted-foreground ml-2">
                                {asset.balance}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Recipient Address</Label>
                    <Input
                      placeholder="Enter wallet address..."
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Network</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ethereum">Ethereum (ERC-20)</SelectItem>
                        <SelectItem value="bsc">BSC (BEP-20)</SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                        <SelectItem value="tron">Tron (TRC-20)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <div className="text-sm text-muted-foreground">
                      Available: {assets.find(a => a.symbol === asset)?.balance} {asset}
                    </div>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg text-sm">
                    <div className="flex justify-between">
                      <span>Network Fee:</span>
                      <span>~0.002 ETH</span>
                    </div>
                  </div>

                  <Button className="w-full">
                    Send {asset}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}