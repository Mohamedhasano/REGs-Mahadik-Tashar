import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Coins,
  TrendingUp,
  DollarSign,
  Settings,
  BarChart3,
  Shield,
  CreditCard,
  Home,
  LogOut,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data
  const stats = {
    totalUsers: 50234,
    activeUsers: 12543,
    totalVolume: 12500000,
    totalAssets: 156,
    pendingKYC: 234,
    activeOrders: 1543
  };

  const tradingPairs = [
    { pair: 'BTC/USDT', volume: 5200000, change: 2.3, status: 'active', liquidity: 'high' },
    { pair: 'ETH/USDT', volume: 3100000, change: -1.2, status: 'active', liquidity: 'high' },
    { pair: 'SDR/USDT', volume: 850000, change: 5.7, status: 'active', liquidity: 'medium' },
    { pair: 'ADA/USDT', volume: 420000, change: 1.5, status: 'active', liquidity: 'medium' },
  ];

  const recentTransactions = [
    { id: 'TXN001', user: 'Ahmed Hassan', type: 'Deposit', amount: 5000, asset: 'USDT', status: 'completed', time: '2 min ago' },
    { id: 'TXN002', user: 'Sara Ali', type: 'Withdraw', amount: 2.5, asset: 'ETH', status: 'pending', time: '5 min ago' },
    { id: 'TXN003', user: 'Omar Khan', type: 'Trade', amount: 10000, asset: 'SDR', status: 'completed', time: '10 min ago' },
    { id: 'TXN004', user: 'Fatima Said', type: 'Deposit', amount: 15000, asset: 'USDT', status: 'completed', time: '15 min ago' },
  ];

  const pendingKYC = [
    { id: 'KYC001', name: 'Mohammed Ali', email: 'mohammed@example.com', country: 'Saudi Arabia', submitted: '2 hours ago', status: 'pending' },
    { id: 'KYC002', name: 'Aisha Ahmed', email: 'aisha@example.com', country: 'UAE', submitted: '5 hours ago', status: 'pending' },
    { id: 'KYC003', name: 'Yusuf Ibrahim', email: 'yusuf@example.com', country: 'Egypt', submitted: '1 day ago', status: 'under_review' },
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
              <div className="text-xs text-red-500 font-semibold">Admin Dashboard</div>
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
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard 🛡️</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
            <Badge variant="destructive" className="text-sm px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Administrator
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Users</span>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-green-500">+{stats.activeUsers.toLocaleString()} active today</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">24h Volume</span>
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold mb-1">${(stats.totalVolume / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-green-500">+12.5% vs yesterday</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Listed Assets</span>
              <Coins className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalAssets}</div>
            <div className="text-sm text-muted-foreground">+5 this month</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Pending KYC</span>
              <CreditCard className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.pendingKYC}</div>
            <div className="text-sm text-amber-500">Requires attention</div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assets">Assets & Pairs</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Assets & Trading Pairs */}
          <TabsContent value="assets">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Trading Pairs Management</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search pairs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pair
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {tradingPairs.map((pair, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold text-sm">
                        {pair.pair.split('/')[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{pair.pair}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>24h Volume: ${(pair.volume / 1000000).toFixed(1)}M</span>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">
                            {pair.liquidity} liquidity
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-lg font-semibold ${pair.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {pair.change >= 0 ? '+' : ''}{pair.change}%
                      </div>
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        {pair.status}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Transactions</h2>
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {recentTransactions.map((txn, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        txn.type === 'Deposit' ? 'bg-green-500/10' : 
                        txn.type === 'Withdraw' ? 'bg-red-500/10' : 'bg-blue-500/10'
                      }`}>
                        <DollarSign className={`h-5 w-5 ${
                          txn.type === 'Deposit' ? 'text-green-500' : 
                          txn.type === 'Withdraw' ? 'text-red-500' : 'text-blue-500'
                        }`} />
                      </div>
                      <div>
                        <div className="font-semibold">{txn.user}</div>
                        <div className="text-sm text-muted-foreground">
                          {txn.id} • {txn.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-semibold">{txn.amount} {txn.asset}</div>
                        <div className="text-sm text-muted-foreground">{txn.type}</div>
                      </div>
                      <Badge variant={txn.status === 'completed' ? 'default' : 'secondary'} className="w-24 justify-center">
                        {txn.status === 'completed' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {txn.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* KYC Verification */}
          <TabsContent value="kyc">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">KYC Verification Queue</h2>
                <Badge variant="secondary">{pendingKYC.length} pending reviews</Badge>
              </div>

              <div className="space-y-3">
                {pendingKYC.map((kyc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                        {kyc.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold">{kyc.name}</div>
                        <div className="text-sm text-muted-foreground">{kyc.email}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {kyc.country} • {kyc.submitted}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={kyc.status === 'pending' ? 'secondary' : 'outline'}>
                        {kyc.status.replace('_', ' ')}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                        Reject
                      </Button>
                      <Button size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Performance Reports</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">User Growth</h3>
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold mb-2">+2,543</div>
                  <div className="text-sm text-muted-foreground">New users this month</div>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>

                <div className="p-6 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Trading Volume</h3>
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="text-3xl font-bold mb-2">$125.4M</div>
                  <div className="text-sm text-muted-foreground">Total volume this month</div>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>

                <div className="p-6 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Revenue</h3>
                    <DollarSign className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="text-3xl font-bold mb-2">$2.5M</div>
                  <div className="text-sm text-muted-foreground">Trading fees collected</div>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>

                <div className="p-6 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Active Orders</h3>
                    <Settings className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stats.activeOrders.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Currently processing</div>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

