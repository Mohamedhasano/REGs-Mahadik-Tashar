import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  ShieldCheck,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  BookOpen,
  Home,
  LogOut,
  Eye,
  Download,
  Upload
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function ShariahBoardDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user || user.role !== 'shariah_board') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data
  const stats = {
    pendingReview: 12,
    approved: 145,
    rejected: 8,
    totalFatwas: 23
  };

  const pendingAssets = [
    {
      id: 'AST001',
      name: 'Polygon (MATIC)',
      symbol: 'MATIC',
      type: 'Cryptocurrency',
      submittedBy: 'Admin Team',
      submittedDate: '2 days ago',
      status: 'pending',
      documents: 4,
      concerns: ['Staking mechanism needs review', 'Smart contract audit required']
    },
    {
      id: 'AST002',
      name: 'Chainlink (LINK)',
      symbol: 'LINK',
      type: 'Cryptocurrency',
      submittedBy: 'Admin Team',
      submittedDate: '5 days ago',
      status: 'under_review',
      documents: 6,
      concerns: ['Oracle pricing model evaluation needed']
    },
  ];

  const pendingProjects = [
    {
      id: 'PRJ001',
      name: 'Islamic DeFi Protocol',
      category: 'DeFi',
      submittedBy: 'Tech Startup Ltd',
      submittedDate: '1 week ago',
      status: 'pending',
      description: 'Sharia-compliant lending and borrowing platform',
      documents: 8,
      concerns: ['Interest-free mechanism needs clarification']
    },
    {
      id: 'PRJ002',
      name: 'Halal NFT Marketplace',
      category: 'NFT',
      submittedBy: 'Digital Arts Inc',
      submittedDate: '3 days ago',
      status: 'under_review',
      description: 'NFT platform for Islamic art and calligraphy',
      documents: 5,
      concerns: []
    },
  ];

  const recentFatwas = [
    {
      id: 'FTW001',
      title: 'Staking in Proof-of-Stake Networks',
      date: '2024-01-15',
      status: 'published',
      summary: 'Ruling on the permissibility of staking in PoS networks'
    },
    {
      id: 'FTW002',
      title: 'NFT Trading Guidelines',
      date: '2024-01-10',
      status: 'published',
      summary: 'Sharia compliance guidelines for NFT trading'
    },
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
              <div className="text-xs text-emerald-600 font-semibold">Shariah Board Dashboard</div>
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
              <h1 className="text-3xl font-bold mb-2">Shariah Board Dashboard ☪️</h1>
              <p className="text-muted-foreground">Assalamu Alaikum, {user?.name}</p>
            </div>
            <Badge variant="outline" className="text-sm px-4 py-2 border-emerald-500 text-emerald-600">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Shariah Scholar
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Pending Review</span>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.pendingReview}</div>
            <div className="text-sm text-amber-500">Requires attention</div>
          </Card>

          <Card className="p-6 border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Approved</span>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.approved}</div>
            <div className="text-sm text-emerald-500">Halal certified</div>
          </Card>

          <Card className="p-6 border-red-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Rejected</span>
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.rejected}</div>
            <div className="text-sm text-red-500">Non-compliant</div>
          </Card>

          <Card className="p-6 border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Published Fatwas</span>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalFatwas}</div>
            <div className="text-sm text-blue-500">Available</div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assets">Assets Review</TabsTrigger>
            <TabsTrigger value="projects">Projects Review</TabsTrigger>
            <TabsTrigger value="fatwas">Fatwas</TabsTrigger>
          </TabsList>

          {/* Assets Review */}
          <TabsContent value="assets">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Assets Pending Shariah Review</h2>
              
              <div className="space-y-4">
                {pendingAssets.map((asset) => (
                  <Card key={asset.id} className="p-6 border-2 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                          {asset.symbol.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{asset.name}</h3>
                            <Badge variant="secondary">{asset.type}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Submitted by {asset.submittedBy} • {asset.submittedDate}
                          </div>
                        </div>
                      </div>
                      <Badge variant={asset.status === 'pending' ? 'secondary' : 'outline'}>
                        {asset.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    {asset.concerns.length > 0 && (
                      <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-amber-600 mb-1">Concerns</div>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {asset.concerns.map((concern, idx) => (
                                <li key={idx}>• {concern}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <FileText className="h-4 w-4" />
                      {asset.documents} documents submitted
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <Textarea 
                        placeholder="Add your Shariah compliance notes and verdict..."
                        className="min-h-[100px]"
                      />
                      <div className="flex items-center gap-2">
                        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve as Halal
                        </Button>
                        <Button variant="destructive" className="flex-1">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button variant="outline">
                          Request More Info
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Projects Review */}
          <TabsContent value="projects">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Launchpad Projects Pending Review</h2>
              
              <div className="space-y-4">
                {pendingProjects.map((project) => (
                  <Card key={project.id} className="p-6 border-2 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg">{project.name}</h3>
                          <Badge variant="secondary">{project.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                        <div className="text-xs text-muted-foreground">
                          Submitted by {project.submittedBy} • {project.submittedDate}
                        </div>
                      </div>
                      <Badge variant={project.status === 'pending' ? 'secondary' : 'outline'}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    {project.concerns.length > 0 && (
                      <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-amber-600 mb-1">Concerns</div>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {project.concerns.map((concern, idx) => (
                                <li key={idx}>• {concern}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <FileText className="h-4 w-4" />
                      {project.documents} documents submitted
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4 mr-1" />
                        Review Documents
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <Textarea 
                        placeholder="Add your Shariah compliance assessment and ruling..."
                        className="min-h-[100px]"
                      />
                      <div className="flex items-center gap-2">
                        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve for Listing
                        </Button>
                        <Button variant="destructive" className="flex-1">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button variant="outline">
                          Request Clarification
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Fatwas */}
          <TabsContent value="fatwas">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Published Fatwas & Rulings</h2>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Publish New Fatwa
                </Button>
              </div>

              <div className="space-y-4">
                {recentFatwas.map((fatwa) => (
                  <Card key={fatwa.id} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold">{fatwa.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{fatwa.summary}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-500">
                        {fatwa.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Published on {new Date(fatwa.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

