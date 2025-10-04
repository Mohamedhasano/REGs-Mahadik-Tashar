import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  Wallet,
  ShieldCheck,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Gift,
  Users,
  BookOpen,
  MessageSquare,
  LogOut,
  Home,
  BarChart3,
  CreditCard,
  HandHeart
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function TraderDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user || user.role !== 'trader') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data - replace with real API calls
  const portfolio = {
    totalBalance: 125840.50,
    change24h: 3.45,
    assets: [
      { name: 'Bitcoin (BTC)', symbol: 'BTC', balance: 1.25, value: 52500, change: 2.3, halal: true },
      { name: 'Ethereum (ETH)', symbol: 'ETH', balance: 15.8, value: 39500, change: -1.2, halal: true },
      { name: 'Sidra (SDR)', symbol: 'SDR', balance: 50000, value: 25000, change: 5.7, halal: true },
      { name: 'Cardano (ADA)', symbol: 'ADA', balance: 20000, value: 8840.50, change: 1.5, halal: true },
    ]
  };

  const stakingPools = [
    { name: 'BTC Halal Pool', apy: '5.2%', staked: 0.5, value: 21000, period: '90 Days' },
    { name: 'ETH Sharia Pool', apy: '8.5%', staked: 5, value: 12500, period: '180 Days' },
    { name: 'Sidra Flexible', apy: '12.0%', staked: 10000, value: 5000, period: 'Flexible' },
  ];

  const recentTrades = [
    { type: 'buy', pair: 'BTC/USDT', amount: 0.15, price: 42000, time: '2 hours ago', status: 'completed' },
    { type: 'sell', pair: 'ETH/USDT', amount: 2.5, price: 2500, time: '5 hours ago', status: 'completed' },
    { type: 'buy', pair: 'SDR/USDT', amount: 5000, price: 0.5, time: '1 day ago', status: 'completed' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-md opacity-30"></div>
              <img 
                src="/regs-logo.jpg" 
                alt="REGs Global Logo" 
                className="relative w-10 h-10 object-cover rounded-full border-2 border-amber-500/30"
              />
            </div>
            <div>
              <div className="font-bold text-lg bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                REGs GLOBAL
              </div>
              <div className="text-xs text-muted-foreground">Trader Dashboard</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
              <p className="text-muted-foreground">Here's your trading overview</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                KYC {user?.kycStatus === 'approved' ? 'Verified' : 'Pending'}
              </Badge>
              {user?.referralCode && (
                <Badge variant="outline" className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-amber-500" />
                  {user.referralCode}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Balance</span>
              <Wallet className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-3xl font-bold mb-1">${portfolio.totalBalance.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +{portfolio.change24h}% (24h)
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Spot Trading</span>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold mb-1">${(portfolio.totalBalance * 0.7).toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">70% of portfolio</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Staking</span>
              <Coins className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold mb-1">${(portfolio.totalBalance * 0.3).toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">30% of portfolio</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Referral Earnings</span>
              <Gift className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold mb-1">${user?.referralEarnings || 0}</div>
            <div className="text-sm text-muted-foreground">{user?.referralCount || 0} referrals</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Assets */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">My Assets</h2>
              <Button size="sm" onClick={() => navigate('/assets')}>
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {portfolio.assets.map((asset, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold">
                      {asset.symbol.substring(0, 1)}
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {asset.name}
                        {asset.halal && (
                          <Badge variant="secondary" className="text-xs">
                            <ShieldCheck className="h-3 w-3 mr-1 text-green-500" />
                            Halal
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{asset.balance} {asset.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${asset.value.toLocaleString()}</div>
                    <div className={`text-sm flex items-center justify-end ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {asset.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(asset.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/trade')}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Spot Trading
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/earn')}>
                <Coins className="h-4 w-4 mr-2" />
                Staking & Earn
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/assets')}>
                <Wallet className="h-4 w-4 mr-2" />
                Deposit/Withdraw
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <HandHeart className="h-4 w-4 mr-2" />
                Zakat Calculator
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/halal-compliance')}>
                <ShieldCheck className="h-4 w-4 mr-2" />
                Halal Compliance
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/profile')}>
                <CreditCard className="h-4 w-4 mr-2" />
                Profile Verification
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/square')}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Community Forum
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Education Center
              </Button>
            </div>
          </Card>
        </div>

        {/* Staking & Recent Trades */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Staking Pools */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Active Staking</h2>
              <Button size="sm" variant="outline" onClick={() => navigate('/earn')}>
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {stakingPools.map((pool, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold">{pool.name}</div>
                      <div className="text-sm text-muted-foreground">{pool.period}</div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      APY {pool.apy}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Staked: {pool.staked}</span>
                    <span className="font-semibold">${pool.value.toLocaleString()}</span>
                  </div>
                  <Progress value={65} className="mt-2 h-1" />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Trades */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Trades</h2>
              <Button size="sm" variant="outline" onClick={() => navigate('/trade')}>
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentTrades.map((trade, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'}>
                        {trade.type.toUpperCase()}
                      </Badge>
                      <span className="font-semibold">{trade.pair}</span>
                    </div>
                    <Badge variant="outline" className="text-green-500">
                      {trade.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {trade.amount} @ ${trade.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">{trade.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

