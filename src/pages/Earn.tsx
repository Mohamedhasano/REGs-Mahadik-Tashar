import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Search, 
  HelpCircle, 
  ChevronRight, 
  Info,
  TrendingUp,
  Shield,
  DollarSign,
  Coins,
  Lock,
  Star,
  Clock,
  ArrowDown
} from "lucide-react";

export default function Earn() {
  const navigate = useNavigate();
  const [totalEarnings] = useState(0.61);
  const [totalEarningsINR] = useState(53.99);
  const [lastDayPNL] = useState(0);

  useEffect(() => {
    document.title = "Earn — High Yield Crypto Staking | REGS Global";
    const desc = "Earn high yields on your crypto assets with Sharia-compliant staking, lending, and savings products. Up to 29% APR on USDT and more.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { 
      meta = document.createElement("meta"); 
      meta.setAttribute("name", "description"); 
      document.head.appendChild(meta); 
    }
    meta.setAttribute("content", desc);
    
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { 
      link = document.createElement("link"); 
      link.setAttribute("rel", "canonical"); 
      document.head.appendChild(link); 
    }
    link.setAttribute("href", window.location.origin + "/earn");
  }, []);

  const earnOptions = [
    { icon: DollarSign, name: "RWUSD", description: "Stablecoin rewards" },
    { icon: Coins, name: "Simple Earn", description: "Flexible savings" },
    { icon: TrendingUp, name: "SOL Staking", description: "Validator staking" },
    { icon: Lock, name: "Loan", description: "Crypto lending" }
  ];

  const featuredProduct = {
    name: "SPK Locked Product APR Boost",
    description: "Enjoy Up to 14.9% APR",
    icon: "⭐",
    gradient: "from-pink-500 via-orange-500 to-yellow-500"
  };

  const earnProducts = [
    {
      symbol: "USDT",
      icon: "💵",
      apy: "29.18%",
      duration: "47D:16H:33M",
      risk: "Low",
      type: "Flexible",
      minAmount: "10 USDT",
      color: "text-emerald-600"
    },
    {
      symbol: "USDC", 
      icon: "💰",
      apy: "26.69%",
      duration: "47D:16H:33M",
      risk: "Low",
      type: "Flexible",
      minAmount: "10 USDC",
      color: "text-blue-600"
    },
    {
      symbol: "SOL",
      icon: "☄️",
      apy: "5.84%",
      duration: "Staking",
      risk: "Medium",
      type: "Locked",
      minAmount: "0.1 SOL",
      color: "text-purple-600"
    },
    {
      symbol: "REGS",
      icon: "🪙",
      apy: "45.50%",
      duration: "30D",
      risk: "Low",
      type: "Locked",
      minAmount: "100 REGS",
      color: "text-primary"
    },
    {
      symbol: "BTC",
      icon: "₿",
      apy: "8.25%",
      duration: "90D",
      risk: "Low",
      type: "Locked",
      minAmount: "0.001 BTC",
      color: "text-orange-600"
    },
    {
      symbol: "ETH",
      icon: "⟠",
      apy: "12.30%",
      duration: "60D",
      risk: "Medium",
      type: "Locked",
      minAmount: "0.01 ETH",
      color: "text-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover-scale">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Earn</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover-scale">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-scale">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Total Earnings Section */}
        <section className="animate-fade-in">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-sm text-muted-foreground">Total Earnings</h2>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-accent">+{totalEarnings.toFixed(2)}</span>
                    <Badge variant="secondary" className="animate-scale-in">USDT</Badge>
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">≈ ₹{totalEarningsINR.toFixed(2)}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="text-sm text-muted-foreground">
                Last Day PNL +{lastDayPNL} USDT
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Earn Options */}
        <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="grid grid-cols-4 gap-4">
            {earnOptions.map(({ icon: Icon, name, description }, index) => (
              <button
                key={name}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200 hover-scale animate-fade-in"
                style={{ animationDelay: `${100 + (index * 50)}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-background border flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{name}</div>
                  <div className="text-xs text-muted-foreground">{description}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Product */}
        <section className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Card className="card-elevated overflow-hidden">
            <CardContent className="p-0">
              <div className={`bg-gradient-to-r ${featuredProduct.gradient} p-6 text-white relative overflow-hidden`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{featuredProduct.name}</h3>
                    <p className="text-white/90 text-sm">{featuredProduct.description}</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl relative">
                    {featuredProduct.icon}
                    <Lock className="absolute -bottom-1 -right-1 w-5 h-5 bg-white/20 rounded-full p-1" />
                  </div>
                </div>
                <div className="flex justify-center mt-4 space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full" />
                  <div className="w-2 h-2 bg-white/60 rounded-full" />
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recommended Section */}
        <section className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recommended</h2>
            <Button variant="ghost" className="text-muted-foreground">More</Button>
          </div>
          
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto-Subscribe</h3>
                  <p className="text-sm text-muted-foreground">Tap to start earning automatically.</p>
                </div>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-950 font-medium px-6">
                  Activate
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Earn Products */}
        <section className="animate-fade-in" style={{ animationDelay: '500ms' }}>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="flexible">Flexible</TabsTrigger>
              <TabsTrigger value="locked">Locked</TabsTrigger>
              <TabsTrigger value="staking">Staking</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-3">
                {earnProducts.map((product, index) => (
                  <Card key={product.symbol} className="card-elevated hover-scale cursor-pointer animate-fade-in" style={{ animationDelay: `${500 + (index * 100)}ms` }}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                            {product.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{product.symbol}</span>
                              <Badge variant="outline" className="text-xs">{product.type}</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">{product.duration}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-lg font-bold ${product.color}`}>
                            {product.apy}
                          </div>
                          <div className="text-xs text-muted-foreground">APR</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Min: {product.minAmount}</span>
                        <Badge variant={product.risk === 'Low' ? 'secondary' : 'outline'} className="text-xs">
                          {product.risk} Risk
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="flexible" className="mt-6">
              <div className="space-y-3">
                {earnProducts.filter(p => p.type === 'Flexible').map((product, index) => (
                  <Card key={product.symbol} className="card-elevated hover-scale cursor-pointer animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                            {product.icon}
                          </div>
                          <div>
                            <span className="font-medium">{product.symbol}</span>
                            <div className="text-xs text-muted-foreground">{product.duration}</div>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${product.color}`}>
                          {product.apy} APR
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="locked" className="mt-6">
              <div className="space-y-3">
                {earnProducts.filter(p => p.type === 'Locked').map((product, index) => (
                  <Card key={product.symbol} className="card-elevated hover-scale cursor-pointer animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                            {product.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{product.symbol}</span>
                              <Lock className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <div className="text-xs text-muted-foreground">{product.duration}</div>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${product.color}`}>
                          {product.apy} APR
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="staking" className="mt-6">
              <div className="space-y-3">
                {earnProducts.filter(p => p.duration === 'Staking').map((product, index) => (
                  <Card key={product.symbol} className="card-elevated hover-scale cursor-pointer animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                            {product.icon}
                          </div>
                          <div>
                            <span className="font-medium">{product.symbol}</span>
                            <div className="text-xs text-muted-foreground">Validator Staking</div>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${product.color}`}>
                          {product.apy} APR
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Sharia Compliance Notice */}
        <section className="animate-fade-in" style={{ animationDelay: '700ms' }}>
          <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 dark:border-amber-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Subscribe to certified Sharia Compliant Earn products.
                  </p>
                  <Button variant="link" className="text-amber-700 dark:text-amber-300 p-0 h-auto font-normal text-sm story-link">
                    View More
                  </Button>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  ×
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Risk Categories */}
        <section className="animate-fade-in" style={{ animationDelay: '800ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-yellow-500 rounded-full" />
                <span className="text-sm font-medium">Low Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">High Yield</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="hover-scale">
              <Info className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <Card className="card-elevated">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">Product</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Est. APR</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}