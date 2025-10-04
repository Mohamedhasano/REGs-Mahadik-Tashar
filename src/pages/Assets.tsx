import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useBinanceTicker } from "../hooks/useBinanceTicker";
import { useAssetBalances, updateAssetPrice } from "../hooks/useAssetBalances";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select";
import AddFundsDrawer from "../components/wallet/AddFundsDrawer";
import SelectCoinSheet from "../components/wallet/SelectCoinSheet";
import SelectNetworkSheet from "../components/wallet/SelectNetworkSheet";
import DepositAddressSheet from "../components/wallet/DepositAddressSheet";
import SendAssetsSheet from "../components/wallet/SendAssetsSheet";
import AssetHistory from "../components/wallet/AssetHistory";
import RegsPaySheet from "../components/wallet/RegsPaySheet";
import BuyWithPKRSheet from "../components/wallet/BuyWithPKRSheet";
import P2PTradingSheet from "../components/wallet/P2PTradingSheet";
import TradeSheet from "../components/wallet/TradeSheet";
import SwapSheet from "../components/wallet/SwapSheet";
import TransferSheet from "../components/wallet/TransferSheet";

export default function Assets() {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Assets — REGs Global";
    const desc = "Your wallet and balances on REGs Global. Coming soon.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.setAttribute("name", "description"); document.head.appendChild(meta); }
    meta.setAttribute("content", desc);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.setAttribute("rel", "canonical"); document.head.appendChild(link); }
    link.setAttribute("href", window.location.origin + "/assets");
  }, []);

  const { lastPrice: btcPrice } = useBinanceTicker("BTC");
  const { lastPrice: ethPrice } = useBinanceTicker("ETH");
  const { lastPrice: solPrice } = useBinanceTicker("SOL");
  const { balances } = useAssetBalances();

  // Update live prices when they change
  useEffect(() => {
    if (btcPrice) updateAssetPrice("BTC", btcPrice);
  }, [btcPrice]);

  useEffect(() => {
    if (ethPrice) updateAssetPrice("ETH", ethPrice);
  }, [ethPrice]);

  const assets = useMemo(() => 
    balances.map(balance => ({
      symbol: balance.symbol,
      amount: balance.amount,
      priceUSD: balance.priceUSD || 0,
      live: balance.live,
    })), [balances]
  );

  const totalUSD = useMemo(() => assets.reduce((sum, a) => sum + a.amount * a.priceUSD, 0), [assets]);

  // Available assets for sending with proper names
  const availableAssets = useMemo(() => [
    { symbol: "BTC", name: "Bitcoin", balance: balances.find(b => b.symbol === "BTC")?.amount || 0 },
    { symbol: "ETH", name: "Ethereum", balance: balances.find(b => b.symbol === "ETH")?.amount || 0 },
    { symbol: "REGS", name: "REGS Token", balance: balances.find(b => b.symbol === "REGS")?.amount || 0 },
    { symbol: "GLNS", name: "GLNS Token", balance: balances.find(b => b.symbol === "GLNS")?.amount || 0 },
    { symbol: "Airland", name: "Airland Token", balance: balances.find(b => b.symbol === "Airland")?.amount || 0 },
  ], [balances]);

  const currencyList = [
    { code: "USD", kind: "fiat", locale: "en-US" },
    { code: "BTC", kind: "crypto" },
    { code: "ETH", kind: "crypto" },
    { code: "SOL", kind: "crypto" },
    { code: "REGS", kind: "crypto" },
  ] as const;

  const [currency, setCurrency] = useState("USD");
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [selectCoinOpen, setSelectCoinOpen] = useState(false);
  const [selectNetworkOpen, setSelectNetworkOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [sendAssetsOpen, setSendAssetsOpen] = useState(false);
  const [regsPayOpen, setRegsPayOpen] = useState(false);
  const [buyWithPKROpen, setBuyWithPKROpen] = useState(false);
  const [p2pTradingOpen, setP2PTradingOpen] = useState(false);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const current = currencyList.find((c) => c.code === currency) ?? currencyList[0];

  const format = (v: number, code: string, locale: string) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: code }).format(v || 0);

  const regsUsd = 1; // placeholder: 1 REGS = $1

  const convertedDisplay = useMemo(() => {
    if (!current) return "—";
    const code = current.code;
    if (current.kind === "fiat") {
      const locale = (current as any).locale ?? "en-US";
      return format(totalUSD, code, locale);
    }
    let denom = 0;
    if (code === "BTC") denom = btcPrice ?? 0;
    else if (code === "ETH") denom = ethPrice ?? 0;
    else if (code === "SOL") denom = solPrice ?? 0;
    else if (code === "REGS") denom = regsUsd;
    if (!denom) return "—";
    const amount = totalUSD / denom;
    return `${amount.toFixed(6)} ${code}`;
  }, [current, totalUSD, btcPrice, ethPrice, solPrice]);

  const todayPnlUSD = 0;

  return (
    <div className="min-h-screen bg-background theme-assets-green">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold gradient-text">Assets</h1>
              <p className="text-muted-foreground mt-2">Portfolio and balances (Sharia compliant).</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <nav aria-label="Assets sections">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="spot">Spot</TabsTrigger>
              <TabsTrigger value="funding">Funding</TabsTrigger>
            </TabsList>
          </nav>
          <section className="mt-4 space-y-4">
            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Est. Total Value</CardTitle>
                    <CardDescription>Across all wallets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="text-3xl font-semibold gradient-text">{convertedDisplay}</div>
                      <div className="w-full sm:w-56">
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger aria-label="Select currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent className="z-50">
                            {currencyList.map((c) => (
                              <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Converted from USD</p>
                  </CardContent>
                </Card>
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Today PNL</CardTitle>
                    <CardDescription>Change since 00:00</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-semibold">{format(todayPnlUSD, "USD", "en-US")}</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                            <Button variant="default" onClick={() => setAddFundsOpen(true)}>Add funds</Button>
                            <Button variant="outline" onClick={() => setSendAssetsOpen(true)}>Send</Button>
                            <Button variant="outline" onClick={() => navigate("/transfer")}>Transfer</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Crypto</CardTitle>
                  <CardDescription>Live prices for BTC/ETH; others are static</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Price (USD)</TableHead>
                        <TableHead className="text-right">Value (USD)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assets.map((a) => {
                        const value = a.amount * a.priceUSD;
                        return (
                          <TableRow key={a.symbol}>
                            <TableCell className="font-medium">{a.symbol}</TableCell>
                            <TableCell className="text-right">{a.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{format(a.priceUSD, "USD", "en-US")}</TableCell>
                            <TableCell className="text-right">{format(value, "USD", "en-US")}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Account details</CardTitle>
                  <CardDescription>Basic account info</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Account type</div>
                      <div className="font-medium">Sharia Compliant</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Status</div>
                      <div className="font-medium">Active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <AssetHistory />
            </TabsContent>
            
            <TabsContent value="spot">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Est. Total Value</CardTitle>
                    <CardDescription>Spot trading wallet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="text-3xl font-semibold gradient-text">{convertedDisplay}</div>
                      <div className="w-full sm:w-56">
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger aria-label="Select currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent className="z-50">
                            {currencyList.map((c) => (
                              <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="default" onClick={() => setAddFundsOpen(true)}>Add funds</Button>
                      <Button variant="outline" onClick={() => setSendAssetsOpen(true)}>Send</Button>
                      <Button variant="outline" onClick={() => navigate("/transfer")}>Transfer</Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Converted from USD</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Crypto</CardTitle>
                  <CardDescription>Live prices for BTC/ETH; others are static</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Price (USD)</TableHead>
                        <TableHead className="text-right">Value (USD)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assets.map((a) => {
                        const value = a.amount * a.priceUSD;
                        return (
                          <TableRow key={a.symbol}>
                            <TableCell className="font-medium">{a.symbol}</TableCell>
                            <TableCell className="text-right">{a.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{format(a.priceUSD, "USD", "en-US")}</TableCell>
                            <TableCell className="text-right">{format(value, "USD", "en-US")}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="funding">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Est. Total Value</CardTitle>
                    <CardDescription>Funding account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="text-3xl font-semibold gradient-text">{convertedDisplay}</div>
                      <div className="w-full sm:w-56">
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger aria-label="Select currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent className="z-50">
                            {currencyList.map((c) => (
                              <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="default" onClick={() => setAddFundsOpen(true)}>Add Funds</Button>
                      <Button variant="outline">Send</Button>
                      <Button variant="outline">Transfer</Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Converted from USD</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Balances</CardTitle>
                  <CardDescription>Funding wallet balances</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Price (USD)</TableHead>
                        <TableHead className="text-right">Value (USD)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assets.map((a) => {
                        const value = a.amount * a.priceUSD;
                        return (
                          <TableRow key={a.symbol}>
                            <TableCell className="font-medium">{a.symbol}</TableCell>
                            <TableCell className="text-right">{a.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{format(a.priceUSD, "USD", "en-US")}</TableCell>
                            <TableCell className="text-right">{format(value, "USD", "en-US")}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </section>
        </Tabs>
      </main>
      
      <AddFundsDrawer
        open={addFundsOpen}
        onOpenChange={setAddFundsOpen}
        onSelect={(m) => {
          if (m === "onchain") {
            setAddFundsOpen(false);
            setSelectCoinOpen(true);
          } else if (m === "regspay") {
            setAddFundsOpen(false);
            setRegsPayOpen(true);
          } else if (m === "fiat") {
            setAddFundsOpen(false);
            setBuyWithPKROpen(true);
          } else if (m === "p2p") {
            setAddFundsOpen(false);
            setP2PTradingOpen(true);
          }
        }}
      />
      <SelectCoinSheet
        open={selectCoinOpen}
        onOpenChange={setSelectCoinOpen}
        onSelectCoin={(symbol) => {
          setSelectedCoin(symbol);
          setSelectCoinOpen(false);
          setSelectNetworkOpen(true);
        }}
      />
      {selectedCoin && (
        <SelectNetworkSheet
          open={selectNetworkOpen}
          onOpenChange={setSelectNetworkOpen}
          coinSymbol={selectedCoin!}
          onSelectNetwork={(id) => {
            setSelectedNetworkId(id);
            setSelectNetworkOpen(false);
            setDepositOpen(true);
          }}
        />
      )}
      {selectedCoin && selectedNetworkId && (
        <DepositAddressSheet
          open={depositOpen}
          onOpenChange={setDepositOpen}
          coinSymbol={selectedCoin!}
          networkId={selectedNetworkId!}
        />
      )}
      <SendAssetsSheet
        open={sendAssetsOpen}
        onOpenChange={setSendAssetsOpen}
        availableAssets={availableAssets}
      />
      <RegsPaySheet
        open={regsPayOpen}
        onOpenChange={setRegsPayOpen}
      />
      <BuyWithPKRSheet
        open={buyWithPKROpen}
        onOpenChange={setBuyWithPKROpen}
      />
      <P2PTradingSheet
        open={p2pTradingOpen}
        onOpenChange={setP2PTradingOpen}
      />
      <TradeSheet
        open={tradeOpen}
        onOpenChange={setTradeOpen}
      />
      <SwapSheet
        open={swapOpen}
        onOpenChange={setSwapOpen}
      />
      <TransferSheet
        open={transferOpen}
        onOpenChange={setTransferOpen}
      />
    </div>
  );
}