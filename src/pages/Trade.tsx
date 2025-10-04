import { useEffect, useMemo, useState } from "react";
import MarketsList from "@/components/trade/MarketsList";
import PriceChart from "@/components/trade/PriceChart";
import OrderBook from "@/components/trade/OrderBook";
import Trades from "@/components/trade/Trades";
import OrderForm from "@/components/trade/OrderForm";
import SpotOrderHistory from "@/components/trade/SpotOrderHistory";
import SpotHoldings from "@/components/trade/SpotHoldings";
import { HalalComplianceIndicator } from "@/components/trade/HalalComplianceIndicator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Gift, ChevronRight, Shield, CheckCircle, AlertTriangle } from "lucide-react";
const ALL_SYMBOLS = ["BTC", "ETH", "GLNS", "AIR", "REGS", "FBAY", "SUKOON", "Freet", "GOLD", "SILVER", "OIL", "WHEAT", "COPPER", "COFFEE"] as const;
export type SymbolCode = typeof ALL_SYMBOLS[number];

const Trade = () => {
  const [symbol, setSymbol] = useState<SymbolCode>("BTC");
  const [mode, setMode] = useState<"convert" | "spot" | "buysell">("convert");
  const TOKENS = ["ETH", "BTC", "SOL", "REGS", "GLNS", "AIR", "FBAY", "SUKOON", "GOLD", "SILVER", "OIL", "WHEAT", "COPPER", "COFFEE"] as const;
  const [from, setFrom] = useState<(typeof TOKENS)[number]>("ETH");
  const [to, setTo] = useState<(typeof TOKENS)[number]>("SOL");
  const [amount, setAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const available: Record<string, number> = { ETH: 0.30218508, BTC: 0.1, SOL: 6.5, REGS: 1000, GLNS: 500, AIR: 250, FBAY: 1500, SUKOON: 2000, GOLD: 2.5, SILVER: 150, OIL: 10, WHEAT: 50, COPPER: 75, COFFEE: 100 };
  
  // Exchange rates (mock data - in USD)
  const exchangeRates: Record<string, number> = {
    ETH: 3400, BTC: 67000, SOL: 230, REGS: 1, GLNS: 0.5, AIR: 0.25, 
    FBAY: 1.09, SUKOON: 0.67, GOLD: 2000, SILVER: 25, OIL: 80, WHEAT: 6, COPPER: 8, COFFEE: 4
  };
  
  const [showPreview, setShowPreview] = useState(false);
  
  // Conversion history state
  const [conversionHistory, setConversionHistory] = useState<Array<{
    id: string;
    from: string;
    to: string;
    fromAmount: string;
    toAmount: string;
    rate: number;
    fee: string;
    finalAmount: string;
    timestamp: Date;
    status: 'completed' | 'pending' | 'failed';
  }>>([]);

  // Buy/Sell tab state
  const [bsSide, setBsSide] = useState<"buy" | "sell">("buy");
  const [fiatCurrency, setFiatCurrency] = useState<"PKR" | "USD">("PKR");
  const [fiatAmount, setFiatAmount] = useState<string>("0");
  const appendKey = (k: string) => {
    setFiatAmount((prev) => {
      if (k === ".") return prev.includes(".") ? prev : prev + ".";
      if (prev === "0") return k;
      return prev + k;
    });
  };
  const backspace = () => setFiatAmount((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
  const rateInrPerUsdt = 83; // mock
  const approxUsdt = Number(fiatAmount || "0") / rateInrPerUsdt;

  
  const symbols = useMemo(() => Array.from(ALL_SYMBOLS), []);

  const swap = () => {
    const tempFrom = from;
    const tempAmount = amount;
    setFrom(to);
    setTo(tempFrom);
    setAmount(toAmount);
    setToAmount(tempAmount);
  };

  // Auto-calculate "To" amount when "From" amount changes
  useEffect(() => {
    if (amount && Number(amount) > 0) {
      const fromRate = exchangeRates[from];
      const toRate = exchangeRates[to];
      if (fromRate && toRate) {
        const fromValueInUsd = Number(amount) * fromRate;
        const toValue = fromValueInUsd / toRate;
        setToAmount(toValue.toFixed(8));
      }
    } else {
      setToAmount("");
    }
  }, [amount, from, to, exchangeRates]);

  // SEO
  useEffect(() => {
    const title = mode === "convert"
      ? `Convert ${from} to ${to} — REGS Global`
      : `${symbol}/USDT — REGS Global Trading Terminal`;
    const desc = mode === "convert"
      ? `Convert digital assets instantly: ${from} to ${to}. Sharia-compliant trading on Sidra Chain ecosystem.`
      : `Trade ${symbol} with Sharia-compliant platform — live chart, order book, trades, and halal trading terminal.`;

    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", window.location.origin + "/trade");
  }, [mode, from, to, symbol]);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-semibold golden-shine-text">REGS Global</h1>
          <p className="text-muted-foreground mt-1">Sharia-Compliant Digital Assets Exchange</p>
          
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="convert">Convert</TabsTrigger>
            <TabsTrigger value="spot">Spot</TabsTrigger>
            <TabsTrigger value="buysell">Buy/Sell</TabsTrigger>
          </TabsList>

          <section className="mt-4 space-y-4">
            <TabsContent value="convert">
              <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/20">
                <Shield className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-800 dark:text-emerald-200">
                  <strong>Sharia Compliant Trading</strong> - All transactions follow Islamic finance principles with immediate settlement and no interest (riba).
                </AlertDescription>
              </Alert>

              <Tabs defaultValue="instant" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="instant">Instant</TabsTrigger>
                  <TabsTrigger value="recurring">Recurring</TabsTrigger>
                  <TabsTrigger value="limit">Limit</TabsTrigger>
                </TabsList>

                <TabsContent value="instant">
                  <Card className="card-elevated">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">From</span>
                        <span className="text-muted-foreground">
                          Available {available[from].toFixed(8)} {from}
                          <button type="button" className="ml-2 text-primary">Max</button>
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-40">
                          <Select value={from} onValueChange={(v) => setFrom(v as any)}>
                            <SelectTrigger aria-label="From token">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TOKENS.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          type="number"
                          placeholder="0.00000028 - 280"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="flex-1"
                        />
                      </div>

                      <div className="my-5 flex justify-center">
                        <Button variant="outline" size="icon" aria-label="Swap" onClick={swap}>
                          <ArrowUpDown />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">To</span>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-40">
                          <Select value={to} onValueChange={(v) => setTo(v as any)}>
                            <SelectTrigger aria-label="To token">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TOKENS.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Input 
                          placeholder="0.00006 - 6500" 
                          value={toAmount}
                          className="flex-1 bg-muted" 
                          readOnly
                        />
                      </div>

                      {amount && Number(amount) > 0 && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm space-y-2">
                          <div className="flex justify-between">
                            <span>Exchange Rate:</span>
                            <span>1 {from} = {(exchangeRates[from] / exchangeRates[to]).toFixed(6)} {to}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Service Fee (Halal):</span>
                            <span>0.1% (No Interest)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Settlement:</span>
                            <span className="text-emerald-600 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Immediate (T+0)
                            </span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>You'll receive:</span>
                            <span>{toAmount} {to}</span>
                          </div>
                        </div>
                      )}

                      <div className="mt-6">
                        <Button 
                          variant="secondary" 
                          className="w-full h-12 rounded-lg" 
                          onClick={() => {
                            if (amount && Number(amount) > 0) {
                              setShowPreview(true);
                            }
                          }}
                          disabled={!amount || Number(amount) <= 0}
                        >
                          {!amount || Number(amount) <= 0 ? 'Enter Amount' : 'Preview Convert'}
                        </Button>
                      </div>

                      {showPreview && amount && Number(amount) > 0 && (
                        <div className="mt-4 p-4 border rounded-lg bg-card">
                          <h3 className="font-medium mb-3">Conversion Preview</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>From:</span>
                              <span>{amount} {from}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>To:</span>
                              <span>{toAmount} {to}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Rate:</span>
                              <span>1 {from} = {(exchangeRates[from] / exchangeRates[to]).toFixed(6)} {to}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Service Fee (Halal):</span>
                              <span>{(Number(amount) * 0.001).toFixed(6)} {from}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Settlement Type:</span>
                              <span className="text-emerald-600 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Spot (Immediate)
                              </span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between font-medium">
                              <span>Final Amount:</span>
                              <span>{(Number(toAmount) * 0.999).toFixed(6)} {to}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => setShowPreview(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              className="flex-1"
                              onClick={() => {
                                const newTransaction = {
                                  id: Date.now().toString(),
                                  from,
                                  to,
                                  fromAmount: amount,
                                  toAmount,
                                  rate: exchangeRates[from] / exchangeRates[to],
                                  fee: (Number(amount) * 0.001).toFixed(6),
                                  finalAmount: (Number(toAmount) * 0.999).toFixed(6),
                                  timestamp: new Date(),
                                  status: 'completed' as const
                                };
                                setConversionHistory(prev => [newTransaction, ...prev]);
                                setShowPreview(false);
                                setAmount("");
                                setToAmount("");
                              }}
                            >
                              Confirm Convert
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="recurring">
                  <Card className="card-elevated">
                    <CardHeader>
                      <CardTitle>Recurring Convert</CardTitle>
                      <CardDescription>Set up automatic recurring conversions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">From</span>
                        <span className="text-muted-foreground">
                          Available {available[from].toFixed(8)} {from}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-40">
                          <Select value={from} onValueChange={(v) => setFrom(v as any)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TOKENS.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          type="number"
                          placeholder="Amount per conversion"
                          className="flex-1"
                        />
                      </div>

                      <div className="my-4 flex justify-center">
                        <Button variant="outline" size="icon" onClick={swap}>
                          <ArrowUpDown />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">To</span>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-40">
                          <Select value={to} onValueChange={(v) => setTo(v as any)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TOKENS.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Input placeholder="Estimated amount" className="flex-1 bg-muted" readOnly />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Frequency</label>
                          <Select defaultValue="daily">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Duration</label>
                          <Select defaultValue="30days">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30days">30 Days</SelectItem>
                              <SelectItem value="90days">90 Days</SelectItem>
                              <SelectItem value="1year">1 Year</SelectItem>
                              <SelectItem value="indefinite">Indefinite</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="auto-enable" />
                        <label htmlFor="auto-enable" className="text-sm">
                          Enable automatic execution
                        </label>
                      </div>

                      <Button className="w-full">
                        Create Recurring Convert
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="limit">
                  <Card className="card-elevated">
                    <CardHeader>
                      <CardTitle>Limit Convert</CardTitle>
                      <CardDescription>Convert when target price is reached</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">From</span>
                        <span className="text-muted-foreground">
                          Available {available[from].toFixed(8)} {from}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-40">
                          <Select value={from} onValueChange={(v) => setFrom(v as any)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TOKENS.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          type="number"
                          placeholder="Amount to convert"
                          className="flex-1"
                        />
                      </div>

                      <div className="my-4 flex justify-center">
                        <Button variant="outline" size="icon" onClick={swap}>
                          <ArrowUpDown />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">To</span>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-40">
                          <Select value={to} onValueChange={(v) => setTo(v as any)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TOKENS.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Input placeholder="Estimated amount" className="flex-1 bg-muted" readOnly />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Target Rate</label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="number"
                            placeholder="Target exchange rate"
                            className="flex-1"
                          />
                          <span className="flex items-center text-sm text-muted-foreground px-3">
                            {from}/{to}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Current rate: 1 {from} = {(exchangeRates[from] / exchangeRates[to]).toFixed(6)} {to}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Order Validity</label>
                        <Select defaultValue="1day">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1day">1 Day</SelectItem>
                            <SelectItem value="3days">3 Days</SelectItem>
                            <SelectItem value="1week">1 Week</SelectItem>
                            <SelectItem value="1month">1 Month</SelectItem>
                            <SelectItem value="gtc">Good Till Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button className="w-full">
                        Place Limit Convert Order
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              {/* Conversion History */}
              {conversionHistory.length > 0 && (
                <Card className="card-elevated mt-4">
                  <CardHeader>
                    <CardTitle>Conversion History</CardTitle>
                    <CardDescription>Your recent conversion transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {conversionHistory.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <span>{transaction.fromAmount} {transaction.from}</span>
                              <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                              <span>{transaction.finalAmount} {transaction.to}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Rate: 1 {transaction.from} = {transaction.rate.toFixed(6)} {transaction.to}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {transaction.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {conversionHistory.length > 5 && (
                      <Button variant="outline" className="w-full mt-3">
                        View All History
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="spot">
              {/* Halal Compliance Alert */}
              <Alert className="mb-4 bg-accent/10 border-accent/20">
                <Shield className="h-4 w-4 text-accent" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Trading with Shariah-compliant principles. View compliance status for each asset.</span>
                  <Button variant="outline" size="sm" onClick={() => window.open('/halal-compliance', '_blank')}>
                    Learn More
                  </Button>
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <section className="lg:col-span-3 order-1">
                  <MarketsList symbols={symbols} selected={symbol} onSelect={(s) => setSymbol(s as SymbolCode)} />
                </section>
                <section className="lg:col-span-6 order-2 space-y-4">
                  <PriceChart symbol={symbol} />
                  <HalalComplianceIndicator symbol={symbol} showDetails />
                </section>
                <section className="lg:col-span-3 order-3">
                  <OrderBook symbol={symbol} />
                </section>
                <section className="lg:col-span-6 order-4">
                  <OrderForm symbol={symbol} />
                </section>
                <section className="lg:col-span-6 order-5">
                  <Trades symbol={symbol} />
                </section>
              </div>

              <div className="mt-6">
                <Tabs defaultValue="open" className="w-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="open">Open Orders (0)</TabsTrigger>
                    <TabsTrigger value="holdings">Holdings (73)</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                  <div className="mt-4">
                    <TabsContent value="open">
                      <Card className="card-elevated">
                        <CardContent className="p-8 text-center">
                          <p className="text-muted-foreground">No open orders</p>
                          <Button className="mt-4">Copy Trading</Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="holdings">
                      <SpotHoldings />
                    </TabsContent>
                    <TabsContent value="history">
                      <SpotOrderHistory />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">{symbol}/USDT Chart</p>
            </TabsContent>


            <TabsContent value="buysell">
              <div className="max-w-xl mx-auto space-y-6">
                <div className="inline-flex rounded-full bg-muted p-1">
                  <Button size="sm" variant={bsSide === "buy" ? "buy" : "ghost"} onClick={() => setBsSide("buy")}>Buy</Button>
                  <Button size="sm" variant={bsSide === "sell" ? "sell" : "ghost"} onClick={() => setBsSide("sell")}>Sell</Button>
                </div>

                <div>
                  <div className="flex items-end gap-3">
                    <div className="text-6xl font-semibold text-muted-foreground">{fiatAmount}</div>
                    <div className="w-28">
                      <Select value={fiatCurrency} onValueChange={(v) => setFiatCurrency(v as any)}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                         <SelectContent className="z-50">
                          <SelectItem value="PKR">PKR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-2 text-muted-foreground flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <span>≈ {approxUsdt.toFixed(2)} USDT</span>
                  </div>
                </div>

                <div className="rounded-lg border p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{bsSide === "buy" ? "Buy" : "Sell"}</div>
                    <div className="font-medium">USDT</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Payment Method</div>
                      <div className="font-medium">Select Payment Option</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="default" className="h-10 text-sm bg-primary text-primary-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary-foreground/20 rounded flex items-center justify-center text-xs font-bold">₿</div>
                        Bank
                      </div>
                    </Button>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-sm text-muted-foreground mb-2">Payment Mode</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="default" size="sm" className="h-8 text-xs justify-start bg-primary text-primary-foreground">
                        Bank Transfer
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs justify-start">
                        Online Banking
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs justify-start">
                        JazzCash
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs justify-start">
                        Easypaisa
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/20 rounded-lg p-4 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Rate</span>
                    <span className="font-medium">1 USDT = ₹{fiatCurrency === "PKR" ? "279.50" : "1.00"}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Processing</span>
                    <span className="font-medium text-green-600">Instant</span>
                  </div>
                </div>

                <Button 
                  className="w-full h-12 rounded-lg" 
                  variant={bsSide === "buy" ? "success" : "destructive"}
                  onClick={() => {
                    if (parseFloat(fiatAmount) > 0) {
                      // Process the buy/sell order
                      const orderType = bsSide === "buy" ? "Buy" : "Sell";
                      const usdtAmount = approxUsdt.toFixed(2);
                      const currency = fiatCurrency;
                      
                      // Here you would normally process the order
                      console.log(`${orderType} ${usdtAmount} USDT for ${fiatAmount} ${currency}`);
                      
                      // Show success message or redirect to confirmation
                      alert(`${orderType} order placed: ${usdtAmount} USDT for ${fiatAmount} ${currency}`);
                      
                      // Reset form
                      setFiatAmount("0");
                    } else {
                      alert("Please enter a valid amount");
                    }
                  }}
                >
                  {bsSide === "buy" ? `Buy ${approxUsdt.toFixed(2)} USDT` : `Sell ${approxUsdt.toFixed(2)} USDT`}
                </Button>

                <div className="grid grid-cols-3 gap-4">
                  {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map((k) => (
                    <Button key={k} variant="outline" className="h-14 text-lg" onClick={() => k === "⌫" ? backspace() : appendKey(k)}>
                      {k}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </section>
        </Tabs>
      </main>
    </div>
  );
};

export default Trade;
