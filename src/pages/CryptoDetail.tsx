import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from "recharts";
import { useBinanceTicker } from "@/hooks/useBinanceTicker";
import { TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface CryptoDetailProps {}

type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

function generateDetailedCandleData(symbol: string, interval: string): Candle[] {
  const base = {
    BTC: 68000,
    ETH: 4636,
    SOL: 200,
    BNB: 600,
    XRP: 0.6,
    DOGE: 0.08,
    GLNS: 2.4,
    AIR: 0.8,
    REGS: 3,
    Falconbay: 1.0,
    Freet: 0.4,
  } as Record<string, number>;

  const startPrice = base[symbol] ?? 100;
  const periods = interval === "1D" ? 24 : interval === "7D" ? 168 : interval === "1M" ? 720 : interval === "1Y" ? 8760 : 8760;
  const data: Candle[] = [];
  
  let currentPrice = startPrice;
  
  for (let i = 0; i < Math.min(periods, 200); i++) {
    const volatility = startPrice * 0.015;
    const change = (Math.random() - 0.5) * volatility;
    
    const open = currentPrice;
    const close = Math.max(0.0001, open + change);
    const high = Math.max(open, close) + Math.random() * volatility * 0.3;
    const low = Math.min(open, close) - Math.random() * volatility * 0.3;
    const volume = Math.random() * 2000000 + 500000;
    
    const now = new Date();
    const timeOffset = (Math.min(periods, 200) - i - 1) * (
      interval === "1D" ? 3600000 : 
      interval === "7D" ? 3600000 : 
      interval === "1M" ? 3600000 : 
      86400000
    );
    const candleTime = new Date(now.getTime() - timeOffset);
    
    data.push({
      time: interval === "1D" ? candleTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
            candleTime.toLocaleDateString([], { month: 'short', day: '2-digit' }),
      open: Number(open.toFixed(4)),
      high: Number(high.toFixed(4)),
      low: Number(low.toFixed(4)),
      close: Number(close.toFixed(4)),
      volume: Math.round(volume)
    });
    
    currentPrice = close;
  }
  
  return data;
}

const CandleBar = (props: any) => {
  const { payload, x, y, width } = props;
  if (!payload) return null;
  
  const { open, high, low, close } = payload;
  const isGreen = close >= open;
  const color = isGreen ? "hsl(var(--chart-success))" : "hsl(var(--chart-danger))";
  
  const bodyHeight = Math.abs(close - open);
  const bodyY = Math.min(close, open);
  const wickWidth = 1;
  
  return (
    <g>
      <line
        x1={x + width / 2}
        y1={high}
        x2={x + width / 2}
        y2={low}
        stroke={color}
        strokeWidth={wickWidth}
      />
      <rect
        x={x + 1}
        y={bodyY}
        width={Math.max(1, width - 2)}
        height={Math.max(1, bodyHeight)}
        fill={color}
        stroke={color}
        strokeWidth={0.5}
        fillOpacity={isGreen ? 0.8 : 1}
      />
    </g>
  );
};

const CryptoDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [timeframe, setTimeframe] = useState("1D");
  const cryptoSymbol = symbol?.toUpperCase() ?? "ETH";
  
  const { enabled, lastPrice } = useBinanceTicker(cryptoSymbol);
  const data = generateDetailedCandleData(cryptoSymbol, timeframe);
  
  const currentPrice = enabled && lastPrice ? lastPrice : data[data.length - 1]?.close ?? 0;
  const prevPrice = data[data.length - 2]?.close ?? currentPrice;
  const priceChange = currentPrice - prevPrice;
  const priceChangePercent = ((priceChange / prevPrice) * 100);
  const isPositive = priceChange >= 0;

  const maxPrice = Math.max(...data.map(d => d.high));
  const minPrice = Math.min(...data.map(d => d.low));
  const yDomain = [minPrice * 0.998, maxPrice * 1.002];

  const timeframes = [
    { value: "1D", label: "1D" },
    { value: "7D", label: "7D" },
    { value: "1M", label: "1M" },
    { value: "1Y", label: "1Y" },
    { value: "All", label: "All" },
    { value: "LOG", label: "LOG" }
  ];

  // SEO
  useEffect(() => {
    document.title = `${cryptoSymbol} Price Chart - REGS Global`;
    
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", `Live ${cryptoSymbol} price chart and market data on REGS Global. Track real-time price movements and trading volume.`);
  }, [cryptoSymbol]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/markets">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Button variant="ghost" className="text-primary border-b-2 border-primary">Chart</Button>
                <Button variant="ghost">Markets</Button>
                <Button variant="ghost">News</Button>
                <Button variant="ghost">Yield</Button>
                <Button variant="ghost">About</Button>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Button className="btn-primary">
                Buy {cryptoSymbol}
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Price Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <h1 className="text-2xl font-bold">{cryptoSymbol}</h1>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-mono font-bold">
                {currentPrice.toLocaleString(undefined, { 
                  style: 'currency', 
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: cryptoSymbol === 'BTC' || cryptoSymbol === 'ETH' ? 2 : 4
                })}
              </span>
              <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${
                isPositive ? 'bg-chart-success/10 text-chart-success' : 'bg-chart-danger/10 text-chart-danger'
              }`}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{isPositive ? '+' : ''}{priceChange.toFixed(4)}</span>
                <span>({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>Market cap: <span className="text-foreground">$1.2T</span></div>
            <div>24h Volume: <span className="text-foreground">$32.4B</span></div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="text-sm text-muted-foreground">Market cap</span>
          </div>
          <Tabs value={timeframe} onValueChange={setTimeframe}>
            <TabsList className="grid grid-cols-6 bg-muted/50">
              {timeframes.map((tf) => (
                <TabsTrigger 
                  key={tf.value} 
                  value={tf.value} 
                  className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {tf.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Chart */}
        <Card className="card-elevated">
          <CardContent className="p-0">
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 20, right: 60, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.1)" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={yDomain}
                    axisLine={false} 
                    tickLine={false}
                    orientation="right"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => {
                      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                      return value.toFixed(value > 1 ? 0 : 4);
                    }}
                    width={70}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="bg-popover border border-border rounded-lg p-4 shadow-lg">
                          <p className="text-sm font-medium text-foreground mb-3">{label}</p>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between gap-6">
                              <span className="text-muted-foreground">Open:</span>
                              <span className="font-mono">${data.open.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between gap-6">
                              <span className="text-muted-foreground">High:</span>
                              <span className="font-mono text-chart-success">${data.high.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between gap-6">
                              <span className="text-muted-foreground">Low:</span>
                              <span className="font-mono text-chart-danger">${data.low.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between gap-6">
                              <span className="text-muted-foreground">Close:</span>
                              <span className="font-mono">${data.close.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey={(entry) => [entry.low, entry.high, entry.open, entry.close]}
                    shape={<CandleBar />}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-elevated">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Market Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h High:</span>
                  <span className="text-chart-success">${maxPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Low:</span>
                  <span className="text-chart-danger">${minPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume (24h):</span>
                  <span>$32.4B</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Supply Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Circulating Supply:</span>
                  <span>{cryptoSymbol === 'BTC' ? '19.7M BTC' : '120.4M ETH'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Supply:</span>
                  <span>{cryptoSymbol === 'BTC' ? '21M BTC' : 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Actions</h3>
              <div className="space-y-2">
                <Button className="w-full btn-primary">
                  Buy {cryptoSymbol}
                </Button>
                <Button variant="outline" className="w-full">
                  Sell {cryptoSymbol}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CryptoDetail;