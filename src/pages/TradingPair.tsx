import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Share2, Bell, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderBook from "@/components/trade/OrderBook";
import OrderForm from "@/components/trade/OrderForm";
import Trades from "@/components/trade/Trades";
import CandlestickChart from "@/components/trade/CandlestickChart";
import SpotOrderHistory from "@/components/trade/SpotOrderHistory";
import { useBinanceTicker } from "@/hooks/useBinanceTicker";
import { useBinanceRestPrice } from "@/hooks/useBinanceRestPrice";
import { useToast } from "@/hooks/use-toast";
import { addSpotOrder, useSpotHistory } from "@/hooks/useSpotHistory";

const TradingPair = () => {
  const { pair } = useParams<{ pair: string }>();
  const symbol = pair?.split('USDT')[0] || 'BTC';
  const { toast } = useToast();
  const { orders } = useSpotHistory();
  
  const { lastPrice, connected } = useBinanceTicker(symbol);
  const { price: restPrice } = useBinanceRestPrice(symbol);
  
  const currentPrice = lastPrice || restPrice || getBasePrice(symbol);
  const priceChange = ((currentPrice - getBasePrice(symbol)) / getBasePrice(symbol)) * 100;
  
  function getBasePrice(symbol: string) {
    const basePrices = { BTC: 119031.98, ETH: 3000, SOL: 250, BNB: 700, XRP: 2.5, DOGE: 0.4 };
    return basePrices[symbol as keyof typeof basePrices] || 100;
  }
  
  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return price.toFixed(4);
  };

  const timeframes = ['15m', '1h', '4h', '1d', 'More'];
  const performanceData = [
    { period: 'Today', value: '0.95%', positive: true },
    { period: '7 Days', value: '2.16%', positive: true },
    { period: '30 Days', value: '1.41%', positive: true },
    { period: '90 Days', value: '14.60%', positive: true },
    { period: '180 Days', value: '22.20%', positive: true },
    { period: '1 Year', value: '95.93%', positive: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link to="/trade">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{symbol}/USDT</h1>
              <Badge variant="secondary" className="text-xs">5x</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                const recentOrders = orders.slice(0, 3);
                if (recentOrders.length > 0) {
                  toast({
                    title: "Recent Orders",
                    description: `${recentOrders.length} recent orders found. Check Order History tab for details.`,
                  });
                } else {
                  toast({
                    title: "No Recent Orders",
                    description: "You haven't placed any orders yet.",
                  });
                }
              }}
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="price" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
          <TabsTrigger value="price" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
            Price
          </TabsTrigger>
          <TabsTrigger value="info" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
            Info
          </TabsTrigger>
          <TabsTrigger value="trading" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
            Trading Data
          </TabsTrigger>
          <TabsTrigger value="square" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none">
            Square
          </TabsTrigger>
        </TabsList>

        <TabsContent value="price" className="mt-0">
          {/* Price Section */}
          <div className="p-4 space-y-4">
            {/* Current Price */}
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold text-destructive">
                  {formatPrice(currentPrice)}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">PKR {(currentPrice * 279.50).toLocaleString()}</span>
                  <span className={priceChange >= 0 ? "text-green-500" : "text-destructive"}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <Badge variant="outline" className="text-xs">POW</Badge>
                  <Badge variant="outline" className="text-xs">Vol</Badge>
                  <Badge variant="outline" className="text-xs">Price Protection</Badge>
                </div>
              </div>
              <div className="text-right text-sm space-y-1">
                <div className="flex justify-between gap-8">
                  <span className="text-muted-foreground">24h High</span>
                  <span>{formatPrice(currentPrice * 1.02)}</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-muted-foreground">24h Low</span>
                  <span>{formatPrice(currentPrice * 0.98)}</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-muted-foreground">24h Vol({symbol})</span>
                  <span>{(Math.random() * 50000).toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-muted-foreground">24h Vol(USDT)</span>
                  <span>{(Math.random() * 1000000000).toFixed(0)}B</span>
                </div>
              </div>
            </div>

            {/* Time Selection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">Time</span>
                {timeframes.map((tf) => (
                  <Button
                    key={tf}
                    variant={tf === '1h' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 px-3"
                  >
                    {tf}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">Depth</Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chart */}
            <div className="h-80">
              <CandlestickChart symbol={symbol} />
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-4 py-4">
              {performanceData.map((item) => (
                <div key={item.period} className="text-center">
                  <div className="text-xs text-muted-foreground">{item.period}</div>
                  <div className={`text-sm font-medium ${item.positive ? 'text-green-500' : 'text-destructive'}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Book and Trades Tabs */}
            <Tabs defaultValue="orderbook" className="w-full">
              <TabsList className="w-full justify-start bg-transparent p-0">
                <TabsTrigger value="orderbook" className="font-medium">Order Book</TabsTrigger>
                <TabsTrigger value="trades" className="font-medium">Trades</TabsTrigger>
                <TabsTrigger value="history" className="font-medium">Order History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orderbook" className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <OrderBook symbol={symbol} />
                  <OrderForm symbol={symbol} />
                </div>
              </TabsContent>
              
              <TabsContent value="trades" className="mt-4">
                <Trades symbol={symbol} />
              </TabsContent>
              
              <TabsContent value="history" className="mt-4">
                <SpotOrderHistory />
              </TabsContent>
            </Tabs>
          </div>

          {/* Bottom Action Buttons */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="text-xs">More</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
                  <div className="h-4 w-4 grid grid-cols-2 gap-px">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                  <span className="text-xs">Hub</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1">
                  <div className="h-4 w-4 flex items-center justify-center">↗</div>
                  <span className="text-xs">Margin</span>
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600 text-white px-8"
                  onClick={() => {
                    addSpotOrder({
                      symbol,
                      side: "buy",
                      price: currentPrice,
                      amount: 1,
                      quote: "USDT"
                    });
                    toast({
                      title: "Buy Order Placed",
                      description: `Successfully bought 1 ${symbol} at ${formatPrice(currentPrice)} USDT`,
                    });
                  }}
                >
                  Buy
                </Button>
                <Button 
                  size="lg" 
                  variant="destructive" 
                  className="px-8"
                  onClick={() => {
                    addSpotOrder({
                      symbol,
                      side: "sell",
                      price: currentPrice,
                      amount: 1,
                      quote: "USDT"
                    });
                    toast({
                      title: "Sell Order Placed",
                      description: `Successfully sold 1 ${symbol} at ${formatPrice(currentPrice)} USDT`,
                    });
                  }}
                >
                  Sell
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="info" className="p-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Token Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market Cap</span>
                  <span>
                    {symbol === 'SUKOON' ? '$1,970,000,000' : `$${(currentPrice * 19700000).toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Supply</span>
                  <span>
                    {symbol === 'SUKOON' ? '100,000,000 SUKOON' : `21,000,000 ${symbol}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Circulating Supply</span>
                  <span>
                    {symbol === 'SUKOON' ? '1,000,000 SUKOON' : `19,700,000 ${symbol}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="p-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Trading Data</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Volume</span>
                  <span>{(Math.random() * 1000000).toFixed(0)} {symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Turnover</span>
                  <span>${(currentPrice * Math.random() * 1000000).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="square" className="p-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <p className="text-muted-foreground">Join the community discussion about {symbol}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingPair;