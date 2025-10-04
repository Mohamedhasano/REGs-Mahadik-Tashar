import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Coins, ShieldCheck, Clock, DollarSign, BarChart3, AlertTriangle } from "lucide-react";

interface Commodity {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  unit: string;
  category: string;
  purity?: string;
  deliveryPeriod: string;
  minOrder: number;
  halalStatus: "halal" | "haram" | "questionable";
  storage: string;
  description: string;
}

const COMMODITIES: Commodity[] = [
  {
    symbol: "GOLD",
    name: "Gold Spot",
    price: 2030.50,
    change24h: 1.25,
    volume: 125000000,
    unit: "USD/oz",
    category: "Precious Metals",
    purity: "99.9%",
    deliveryPeriod: "T+2",
    minOrder: 1,
    halalStatus: "halal",
    storage: "Certified Vaults",
    description: "Physical gold trading with immediate settlement and secure storage"
  },
  {
    symbol: "SILVER",
    name: "Silver Spot",
    price: 24.85,
    change24h: -0.45,
    volume: 45000000,
    unit: "USD/oz",
    category: "Precious Metals",
    purity: "99.9%",
    deliveryPeriod: "T+2",
    minOrder: 50,
    halalStatus: "halal",
    storage: "Certified Vaults",
    description: "Physical silver trading with spot settlement"
  },
  {
    symbol: "OIL",
    name: "Crude Oil WTI",
    price: 78.30,
    change24h: 2.15,
    volume: 850000000,
    unit: "USD/barrel",
    category: "Energy",
    deliveryPeriod: "T+0",
    minOrder: 1000,
    halalStatus: "halal",
    storage: "Tank Terminals",
    description: "West Texas Intermediate crude oil spot trading"
  },
  {
    symbol: "WHEAT",
    name: "Wheat",
    price: 685.25,
    change24h: 0.85,
    volume: 125000000,
    unit: "USD/bushel",
    category: "Agricultural",
    deliveryPeriod: "T+7",
    minOrder: 5000,
    halalStatus: "halal",
    storage: "Grain Elevators",
    description: "Premium wheat with quality certification"
  },
  {
    symbol: "COPPER",
    name: "Copper",
    price: 8.45,
    change24h: -1.20,
    volume: 320000000,
    unit: "USD/lb",
    category: "Industrial Metals",
    purity: "99.9%",
    deliveryPeriod: "T+3",
    minOrder: 25000,
    halalStatus: "halal",
    storage: "LME Warehouses",
    description: "High-grade copper cathodes for industrial use"
  },
  {
    symbol: "COFFEE",
    name: "Arabica Coffee",
    price: 1.65,
    change24h: 3.20,
    volume: 85000000,
    unit: "USD/lb",
    category: "Agricultural",
    deliveryPeriod: "T+14",
    minOrder: 37500,
    halalStatus: "halal",
    storage: "Certified Warehouses",
    description: "Premium Arabica coffee beans with origin certification"
  }
];

const CommodityCard = ({ commodity }: { commodity: Commodity }) => {
  const isPositive = commodity.change24h > 0;
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 animate-fade-in card-elevated">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{commodity.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{commodity.symbol}</p>
            </div>
          </div>
          <Badge variant={commodity.halalStatus === "halal" ? "default" : "destructive"} className="gap-1">
            <ShieldCheck className="h-3 w-3" />
            {commodity.halalStatus.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">${commodity.price.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{commodity.unit}</p>
          </div>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="font-medium">{isPositive ? '+' : ''}{commodity.change24h}%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Volume (24h)</p>
            <p className="font-medium">${(commodity.volume / 1000000).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-muted-foreground">Category</p>
            <p className="font-medium">{commodity.category}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Min Order</p>
            <p className="font-medium">{commodity.minOrder.toLocaleString()} {commodity.unit.split('/')[1]}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Settlement</p>
            <p className="font-medium">{commodity.deliveryPeriod}</p>
          </div>
        </div>
        
        {commodity.purity && (
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">Purity: {commodity.purity}</Badge>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground">{commodity.description}</p>
        
        <div className="flex gap-2">
          <Button className="flex-1" size="sm">
            Buy Now
          </Button>
          <Button variant="outline" className="flex-1" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Commodities() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    document.title = "Physical Commodities Trading — REGS Global";
    const desc = "Trade physical and tangible commodities including gold, silver, oil, wheat. Sharia-compliant spot trading with immediate settlement.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.setAttribute("name", "description"); document.head.appendChild(meta); }
    meta.setAttribute("content", desc);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.setAttribute("rel", "canonical"); document.head.appendChild(link); }
    link.setAttribute("href", window.location.origin + "/commodities");
  }, []);

  const categories = ["all", ...Array.from(new Set(COMMODITIES.map(c => c.category)))];
  
  const filteredCommodities = COMMODITIES
    .filter(commodity => {
      const matchesCategory = selectedCategory === "all" || commodity.category === selectedCategory;
      const matchesSearch = commodity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           commodity.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price": return b.price - a.price;
        case "change": return b.change24h - a.change24h;
        case "volume": return b.volume - a.volume;
        default: return a.name.localeCompare(b.name);
      }
    });

  const totalMarketCap = COMMODITIES.reduce((sum, c) => sum + (c.price * c.volume / c.price), 0);
  const avgChange = COMMODITIES.reduce((sum, c) => sum + c.change24h, 0) / COMMODITIES.length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Physical Commodities</h1>
              <p className="text-muted-foreground mt-1">
                Trade physical and tangible assets with immediate settlement - Fully Sharia compliant
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">100% Halal Certified</span>
            </div>
          </div>
          
          {/* Market Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Markets</span>
                </div>
                <p className="text-2xl font-bold mt-1">{COMMODITIES.length}</p>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">24h Volume</span>
                </div>
                <p className="text-2xl font-bold mt-1">${(totalMarketCap / 1000000000).toFixed(1)}B</p>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  {avgChange > 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
                  <span className="text-sm text-muted-foreground">Avg Change</span>
                </div>
                <p className={`text-2xl font-bold mt-1 ${avgChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {avgChange > 0 ? '+' : ''}{avgChange.toFixed(2)}%
                </p>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Settlement</span>
                </div>
                <p className="text-2xl font-bold mt-1">T+0 to T+14</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="spot" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="spot" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Spot Trading
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Halal Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="spot" className="space-y-6">
            {/* Filters */}
            <Card className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search commodities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="change">24h Change</SelectItem>
                      <SelectItem value="volume">Volume</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Commodities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommodities.map((commodity, index) => (
                <div
                  key={commodity.symbol}
                  className="animate-fade-in"
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <CommodityCard commodity={commodity} />
                </div>
              ))}
            </div>

            {filteredCommodities.length === 0 && (
              <Card className="animate-fade-in">
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No commodities found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  Sharia Compliance for Commodities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    ✅ Why Commodities are Halal
                  </h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• <strong>Physical Assets:</strong> Tangible, real-world value</li>
                    <li>• <strong>Immediate Settlement:</strong> No interest-based delays</li>
                    <li>• <strong>Real Ownership:</strong> Actual possession or certified storage</li>
                    <li>• <strong>No Speculation:</strong> Based on real supply and demand</li>
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Compliance Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Spot trading only (T+0 to T+14)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Physical delivery available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">No interest-based financing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Certified storage facilities</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Available Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Precious Metals (Gold, Silver)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Energy (Crude Oil, Natural Gas)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Agricultural (Wheat, Coffee, Sugar)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">Industrial Metals (Copper, Aluminum)</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}