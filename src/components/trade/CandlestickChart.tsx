import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, LineChart, Line, ReferenceLine } from "recharts";
import { useBinanceTicker } from "@/hooks/useBinanceTicker";
import { useBinanceKlines } from "@/hooks/useBinanceKlines";
import { TrendingUp, TrendingDown, Volume2 } from "lucide-react";

interface CandlestickChartProps {
  symbol: string;
}

type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

function generateCandleData(symbol: string, interval: string): Candle[] {
  const base = {
    BTC: 68000,
    ETH: 3000,
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
  const periods = interval === "1m" ? 60 : interval === "5m" ? 48 : interval === "15m" ? 32 : interval === "1h" ? 24 : 20;
  const data: Candle[] = [];
  
  let currentPrice = startPrice;
  
  for (let i = 0; i < periods; i++) {
    const volatility = startPrice * 0.02;
    const change = (Math.random() - 0.5) * volatility;
    
    const open = currentPrice;
    const close = Math.max(0.0001, open + change);
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.random() * 1000000 + 100000;
    
    const now = new Date();
    const timeOffset = (periods - i - 1) * (interval === "1m" ? 60000 : interval === "5m" ? 300000 : interval === "15m" ? 900000 : interval === "1h" ? 3600000 : 86400000);
    const candleTime = new Date(now.getTime() - timeOffset);
    
    data.push({
      time: interval === "1m" || interval === "5m" ? candleTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
            interval === "15m" || interval === "1h" ? candleTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
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

// Custom Candlestick Shape Component - Binance Style
const CandleBar = (props: any) => {
  const { payload, x, y, width, height } = props;
  if (!payload || !payload.open || !payload.close || !payload.high || !payload.low) return null;
  
  const { open, high, low, close } = payload;
  const isGreen = close >= open;
  const color = isGreen ? "#00C853" : "#FF5252"; // Binance green/red colors
  
  // Calculate positions
  const candleWidth = Math.max(width - 2, 1);
  const bodyHeight = Math.abs(close - open);
  const bodyTop = Math.min(open, close);
  const bodyBottom = Math.max(open, close);
  
  // Scale to chart coordinates
  const priceRange = high - low || 0.0001;
  const scale = height / priceRange;
  
  const highY = y;
  const lowY = y + height;
  const bodyTopY = y + (high - bodyBottom) * scale;
  const bodyBottomY = y + (high - bodyTop) * scale;
  const bodyHeightPx = Math.max(Math.abs(bodyBottomY - bodyTopY), 1);
  
  const wickX = x + width / 2;
  
  return (
    <g>
      {/* High-Low Wick */}
      <line
        x1={wickX}
        y1={y + (high - high) * scale}
        x2={wickX}
        y2={y + (high - bodyBottom) * scale}
        stroke={color}
        strokeWidth={1}
      />
      <line
        x1={wickX}
        y1={y + (high - bodyTop) * scale}
        x2={wickX}
        y2={y + (high - low) * scale}
        stroke={color}
        strokeWidth={1}
      />
      
      {/* Candle Body */}
      <rect
        x={x + 1}
        y={bodyTopY}
        width={candleWidth}
        height={bodyHeightPx}
        fill={isGreen ? color : "transparent"}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

const CandlestickChart = ({ symbol }: CandlestickChartProps) => {
  const [timeframe, setTimeframe] = useState("15m");
  const [chartType, setChartType] = useState<"candlestick" | "line">("candlestick");
  
  // Fetch live data from Binance
  const { klines, loading } = useBinanceKlines(symbol, timeframe, 100);
  const { enabled, lastPrice } = useBinanceTicker(symbol);
  
  // Use live data if available, otherwise fallback to mock data
  const data = useMemo(() => {
    if (klines.length > 0) {
      return klines.map((candle) => ({
        time: new Date(candle.time).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume
      }));
    }
    return generateCandleData(symbol, timeframe);
  }, [klines, symbol, timeframe]);
  
  const currentPrice = enabled && lastPrice ? lastPrice : data[data.length - 1]?.close ?? 0;
  const prevPrice = data[data.length - 2]?.close ?? currentPrice;
  const priceChange = currentPrice - prevPrice;
  const priceChangePercent = ((priceChange / prevPrice) * 100);
  const isPositive = priceChange >= 0;

  const maxPrice = Math.max(...data.map(d => d.high));
  const minPrice = Math.min(...data.map(d => d.low));
  const yDomain = [minPrice * 0.999, maxPrice * 1.001];

  const timeframes = [
    { value: "1m", label: "1m" },
    { value: "3m", label: "3m" },
    { value: "5m", label: "5m" },
    { value: "15m", label: "15m" },
    { value: "30m", label: "30m" },
    { value: "1h", label: "1h" },
    { value: "2h", label: "2h" },
    { value: "4h", label: "4h" },
    { value: "6h", label: "6h" },
    { value: "8h", label: "8h" },
    { value: "12h", label: "12h" },
    { value: "1d", label: "1d" },
    { value: "3d", label: "3d" },
    { value: "1w", label: "1w" },
    { value: "1M", label: "1M" }
  ];

  const primaryTimeframes = ["1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h"];
  const secondaryTimeframes = ["6h", "8h", "12h", "1d", "3d", "1w", "1M"];

  // Show loading state
  if (loading && data.length === 0) {
    return (
      <Card className="card-elevated h-full">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-muted-foreground">Loading live chart data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elevated h-full">
      <CardHeader className="py-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">{symbol}/USDT</h3>
            <div className="flex items-center gap-2">
              <span className="text-xl font-mono">{currentPrice.toLocaleString()}</span>
              <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-chart-success' : 'text-chart-danger'}`}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{isPositive ? '+' : ''}{priceChange.toFixed(4)}</span>
                <span>({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={chartType === "candlestick" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("candlestick")}
            >
              Candles
            </Button>
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("line")}
            >
              Line
            </Button>
          </div>
        </div>
        
        
        <div className="space-y-3">
          {/* Primary Timeframes */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {primaryTimeframes.map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                  className={`h-7 px-2 text-xs font-medium transition-all ${
                    timeframe === tf 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {tf}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant={chartType === "candlestick" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("candlestick")}
                className="h-7 px-2 text-xs"
              >
                <span className="text-sm">📊</span>
              </Button>
              <Button
                variant={chartType === "line" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("line")}
                className="h-7 px-2 text-xs"
              >
                <span className="text-sm">📈</span>
              </Button>
            </div>
          </div>

          {/* Secondary Timeframes */}
          <div className="flex items-center gap-1">
            {secondaryTimeframes.map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={`h-6 px-2 text-xs font-medium transition-all ${
                  timeframe === tf 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="h-[500px] space-y-4">
        {/* Main Price Chart */}
        <div className="h-[75%]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "candlestick" ? (
              <ComposedChart 
                data={data} 
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid 
                  strokeDasharray="1 1" 
                  stroke="hsl(var(--border))" 
                  strokeOpacity={0.3}
                  horizontal={true}
                  vertical={false}
                />
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
                    if (value >= 100000) return `${(value / 1000).toFixed(0)}K`;
                    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                    return value.toFixed(value > 1 ? 2 : 4);
                  }}
                  width={60}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload[0]) return null;
                    const data = payload[0].payload;
                    const isGreen = data.close >= data.open;
                    return (
                      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                        <p className="text-sm font-medium mb-2">{label}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between gap-6">
                            <span className="text-muted-foreground">O:</span>
                            <span className="font-mono">{data.open?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between gap-6">
                            <span className="text-muted-foreground">H:</span>
                            <span className="font-mono text-green-500">{data.high?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between gap-6">
                            <span className="text-muted-foreground">L:</span>
                            <span className="font-mono text-red-500">{data.low?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between gap-6">
                            <span className="text-muted-foreground">C:</span>
                            <span className={`font-mono ${isGreen ? 'text-green-500' : 'text-red-500'}`}>
                              {data.close?.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-6">
                            <span className="text-muted-foreground">Vol:</span>
                            <span className="font-mono">{data.volume?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="close"
                  shape={<CandleBar />}
                />
              </ComposedChart>
            ) : (
              <LineChart 
                data={data} 
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid 
                  strokeDasharray="1 1" 
                  stroke="hsl(var(--border))" 
                  strokeOpacity={0.3}
                  horizontal={true}
                  vertical={false}
                />
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
                    if (value >= 100000) return `${(value / 1000).toFixed(0)}K`;
                    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                    return value.toFixed(value > 1 ? 2 : 4);
                  }}
                  width={60}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload[0]) return null;
                    const value = payload[0].value as number;
                    return (
                      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                        <p className="text-sm font-medium mb-1">{label}</p>
                        <p className="text-sm font-mono">Price: {value?.toFixed(2)}</p>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#F7931A"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#F7931A" }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        
        
        {/* Volume Chart */}
        <div className="h-[25%] border-t pt-2">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Volume</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 0, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="time" hide />
              <YAxis 
                orientation="right" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                width={60}
                tickFormatter={(value) => {
                  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return value.toString();
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload[0]) return null;
                  return (
                    <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-mono">Volume: {payload[0].value?.toLocaleString()}</p>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="volume"
                fill="#00C853"
                shape={(props: any) => {
                  const { payload, x, y, width, height } = props;
                  if (!payload) return null;
                  const isGreen = payload.close >= payload.open;
                  const color = isGreen ? "#00C853" : "#FF5252";
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={color}
                      fillOpacity={0.7}
                    />
                  );
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandlestickChart;