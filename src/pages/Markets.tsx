import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Shield, 
  ArrowLeft,
  Sparkles,
  Filter,
  ChevronRight,
  Flame,
  Zap
} from 'lucide-react';
import BottomNav from '@/components/layout/BottomNav';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const markets = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$67,234.50', change: '+2.45%', volume: '$28.5B', halal: true, category: 'crypto', rank: 1, hot: true },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,456.78', change: '+1.23%', volume: '$15.2B', halal: true, category: 'crypto', rank: 2, hot: true },
  { symbol: 'GOLD', name: 'Gold Token', price: '$2,045.20', change: '+0.87%', volume: '$5.8B', halal: true, category: 'rwa', rank: 3, hot: false },
  { symbol: 'SILVER', name: 'Silver Token', price: '$24.50', change: '-0.45%', volume: '$2.1B', halal: true, category: 'rwa', rank: 4, hot: false },
  { symbol: 'MATIC', name: 'Polygon', price: '$0.8523', change: '+3.56%', volume: '$890M', halal: true, category: 'crypto', rank: 5, hot: true },
  { symbol: 'SOL', name: 'Solana', price: '$98.45', change: '+5.23%', volume: '$2.3B', halal: true, category: 'crypto', rank: 6, hot: true },
  { symbol: 'ADA', name: 'Cardano', price: '$0.4523', change: '-1.23%', volume: '$450M', halal: true, category: 'crypto', rank: 7, hot: false },
  { symbol: 'DOT', name: 'Polkadot', price: '$6.78', change: '+2.34%', volume: '$380M', halal: true, category: 'crypto', rank: 8, hot: false },
  { symbol: 'PROPERTY', name: 'Dubai Real Estate', price: '$156.23', change: '+0.45%', volume: '$125M', halal: true, category: 'rwa', rank: 9, hot: false },
  { symbol: 'SUKUK', name: 'Islamic Bonds', price: '$100.50', change: '+0.12%', volume: '$80M', halal: true, category: 'rwa', rank: 10, hot: false },
];

export default function Markets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         market.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || market.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-b border-amber-500/20">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-amber-400">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Markets
              </h1>
              <p className="text-xs text-slate-400 font-semibold">10,000+ Halal Assets</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-amber-400">
                <Star className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Hero Banner - Premium */}
        <Card className="relative p-10 mb-8 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 border-0 overflow-hidden">
          {/* Animated background effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="relative flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm text-sm font-bold px-4 py-1">
                  100% HALAL CERTIFIED
                </Badge>
              </div>
              <h2 className="text-4xl font-black mb-3 text-white drop-shadow-2xl">
                Trade with Confidence
              </h2>
              <p className="text-emerald-50 text-lg mb-6 max-w-md drop-shadow-lg">
                All assets verified and approved by our Sharia scholars board
              </p>
              <Link to="/halal-compliance">
                <Button size="sm" className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                  <Sparkles className="mr-2 h-4 w-4" />
                  View Certification
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Shield className="h-32 w-32 text-white/10" />
          </div>
        </Card>

        {/* Search & Filters - Enhanced */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <Input
              placeholder="Search markets by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-slate-900/50 border-2 border-slate-800 focus:border-amber-500/50 text-white placeholder:text-slate-500 backdrop-blur-sm"
            />
          </div>
          <Button className="h-14 px-8 bg-slate-900/50 border-2 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 text-white backdrop-blur-sm">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </Button>
        </div>

        {/* Tabs - Premium */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="w-full grid grid-cols-3 h-14 bg-slate-900/50 border-2 border-slate-800 backdrop-blur-sm p-1">
            <TabsTrigger 
              value="all" 
              onClick={() => setCategory('all')}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-600 data-[state=active]:text-slate-950 font-bold text-slate-400"
            >
              All Markets
            </TabsTrigger>
            <TabsTrigger 
              value="crypto" 
              onClick={() => setCategory('crypto')}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white font-bold text-slate-400"
            >
              <Zap className="h-4 w-4 mr-2" />
              Crypto
            </TabsTrigger>
            <TabsTrigger 
              value="rwa" 
              onClick={() => setCategory('rwa')}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white font-bold text-slate-400"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              RWA
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Markets List - Ultra Premium */}
        <div className="space-y-4">
          {filteredMarkets.map((market) => (
            <Link key={market.symbol} to={`/trading/${market.symbol}USDT`}>
              <Card className="relative p-6 bg-slate-900/50 border-2 border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1 group cursor-pointer backdrop-blur-sm overflow-hidden">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Icon */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        {market.symbol.substring(0, 2)}
                      </div>
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-black text-xl text-white group-hover:text-amber-400 transition-colors">
                          {market.symbol}
                        </span>
                        {market.halal && (
                          <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold px-2 py-0.5 shadow-lg shadow-emerald-500/50">
                            <Shield className="h-3 w-3 mr-1" />
                            HALAL
                          </Badge>
                        )}
                        {market.hot && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold px-2 py-0.5 shadow-lg shadow-orange-500/50 animate-pulse">
                            <Flame className="h-3 w-3 mr-1" />
                            HOT
                          </Badge>
                        )}
                        <span className="text-xs text-slate-500 font-semibold">
                          #{market.rank}
                        </span>
                      </div>
                      <div className="text-base text-slate-400 font-medium">{market.name}</div>
                      <div className="text-sm text-slate-500 mt-1">
                        Vol: <span className="text-slate-400 font-semibold">{market.volume}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Change */}
                  <div className="text-right">
                    <div className="font-black text-2xl text-white mb-2">{market.price}</div>
                    <div className={`text-base font-bold flex items-center justify-end gap-2 mb-1 ${
                      market.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {market.change.startsWith('+') ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                      {market.change}
                    </div>
                    <div className={`text-xs font-semibold ${
                      market.change.startsWith('+') ? 'text-emerald-500/70' : 'text-red-500/70'
                    }`}>
                      24h Change
                    </div>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-8 w-8 text-amber-400" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredMarkets.length === 0 && (
          <Card className="p-16 text-center bg-slate-900/50 border-2 border-slate-800 backdrop-blur-sm">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-black mb-3 text-white">No markets found</h3>
            <p className="text-slate-400 text-lg">
              Try a different search term or filter
            </p>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
