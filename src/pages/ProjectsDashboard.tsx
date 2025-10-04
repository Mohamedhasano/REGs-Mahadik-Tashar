import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Rocket,
  FileText,
  Users,
  DollarSign,
  Home,
  LogOut,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  MessageSquare,
  Eye
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function ProjectsDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'project') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data
  const stats = {
    submissions: 3,
    approved: 1,
    pending: 1,
    rejected: 1,
    totalRaised: 250000,
    investors: 145
  };

  const myProjects = [
    {
      id: 'PRJ-001',
      name: 'Islamic DeFi Protocol',
      category: 'DeFi',
      status: 'approved',
      submittedDate: '2024-01-10',
      shariahReviewDate: '2024-01-15',
      fundingGoal: 500000,
      fundingRaised: 250000,
      investors: 145,
      daysLeft: 45,
      description: 'Sharia-compliant lending and borrowing platform',
      documents: 8
    },
    {
      id: 'PRJ-002',
      name: 'Halal NFT Marketplace',
      category: 'NFT',
      status: 'under_review',
      submittedDate: '2024-01-18',
      shariahReviewDate: null,
      fundingGoal: 300000,
      fundingRaised: 0,
      investors: 0,
      daysLeft: null,
      description: 'NFT platform for Islamic art and calligraphy',
      documents: 5
    },
    {
      id: 'PRJ-003',
      name: 'Crypto Education Platform',
      category: 'Education',
      status: 'rejected',
      submittedDate: '2024-01-05',
      shariahReviewDate: '2024-01-08',
      rejectionReason: 'Business model needs revision to comply with Shariah',
      fundingGoal: 100000,
      fundingRaised: 0,
      investors: 0,
      daysLeft: null,
      description: 'Online platform for Islamic crypto education',
      documents: 4
    },
  ];

  const investors = [
    { name: 'Ahmed Hassan', amount: 5000, date: '2024-01-20', status: 'confirmed' },
    { name: 'Sara Ali', amount: 10000, date: '2024-01-19', status: 'confirmed' },
    { name: 'Omar Khan', amount: 7500, date: '2024-01-18', status: 'confirmed' },
    { name: 'Fatima Said', amount: 3000, date: '2024-01-17', status: 'pending' },
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
              <div className="text-xs text-purple-600 font-semibold">Projects Launchpad</div>
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
              <h1 className="text-3xl font-bold mb-2">Projects Dashboard 🚀</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
            <Badge variant="outline" className="text-sm px-4 py-2 border-purple-500 text-purple-600">
              <Rocket className="h-4 w-4 mr-2" />
              Project Owner
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Submissions</span>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.submissions}</div>
            <div className="text-sm text-muted-foreground">All time</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Approved Projects</span>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.approved}</div>
            <div className="text-sm text-emerald-500">Active fundraising</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Raised</span>
              <DollarSign className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-3xl font-bold mb-1">${stats.totalRaised.toLocaleString()}</div>
            <div className="text-sm text-amber-500">From {stats.investors} investors</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Under Review</span>
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.pending}</div>
            <div className="text-sm text-purple-500">Awaiting approval</div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
            <TabsTrigger value="submit">Submit New Project</TabsTrigger>
          </TabsList>

          {/* My Projects */}
          <TabsContent value="projects">
            <div className="space-y-6">
              {myProjects.map((project) => (
                <Card key={project.id} className="p-6 border-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                        {project.name.substring(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-xl">{project.name}</h3>
                          <Badge variant="secondary">{project.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                        <div className="text-xs text-muted-foreground">
                          Submitted: {new Date(project.submittedDate).toLocaleDateString()}
                          {project.shariahReviewDate && (
                            <> • Reviewed: {new Date(project.shariahReviewDate).toLocaleDateString()}</>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        project.status === 'approved' ? 'default' :
                        project.status === 'under_review' ? 'secondary' : 'destructive'
                      }
                      className="text-sm px-3 py-1"
                    >
                      {project.status === 'approved' && <CheckCircle className="h-4 w-4 mr-1" />}
                      {project.status === 'under_review' && <Clock className="h-4 w-4 mr-1" />}
                      {project.status === 'rejected' && <XCircle className="h-4 w-4 mr-1" />}
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  {project.status === 'approved' && (
                    <>
                      <div className="grid md:grid-cols-3 gap-6 mb-4">
                        <div className="p-4 rounded-lg bg-muted/30">
                          <div className="text-sm text-muted-foreground mb-1">Funding Goal</div>
                          <div className="text-2xl font-bold">${project.fundingGoal.toLocaleString()}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/30">
                          <div className="text-sm text-muted-foreground mb-1">Raised</div>
                          <div className="text-2xl font-bold text-emerald-600">${project.fundingRaised.toLocaleString()}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/30">
                          <div className="text-sm text-muted-foreground mb-1">Investors</div>
                          <div className="text-2xl font-bold text-purple-600">{project.investors}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">
                            {((project.fundingRaised / project.fundingGoal) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={(project.fundingRaised / project.fundingGoal) * 100} 
                          className="h-2"
                        />
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {project.daysLeft} days left
                        </div>
                        <Button size="sm" variant="outline">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View Campaign
                        </Button>
                      </div>
                    </>
                  )}

                  {project.status === 'under_review' && (
                    <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 mb-4">
                      <div className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div>
                          <div className="font-semibold text-purple-600 mb-1">Under Shariah Review</div>
                          <p className="text-sm text-muted-foreground">
                            Your project is currently being reviewed by our Shariah board. You will be notified once the review is complete.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {project.status === 'rejected' && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                      <div className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <div className="font-semibold text-red-600 mb-1">Rejection Reason</div>
                          <p className="text-sm text-muted-foreground">{project.rejectionReason}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      {project.documents} Documents
                    </Button>
                    {project.status === 'approved' && (
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Engage Investors
                      </Button>
                    )}
                    {project.status === 'rejected' && (
                      <Button size="sm">
                        Resubmit Project
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Investors */}
          <TabsContent value="investors">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Your Investors</h2>
              
              <div className="space-y-3">
                {investors.map((investor, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                        {investor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold">{investor.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(investor.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-lg">${investor.amount.toLocaleString()}</div>
                        <Badge variant={investor.status === 'confirmed' ? 'default' : 'secondary'}>
                          {investor.status}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Submit New Project */}
          <TabsContent value="submit">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Submit New Project for Shariah Review</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Project Name</label>
                  <Input 
                    placeholder="Enter your project name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select className="w-full h-10 px-3 rounded-md border border-border bg-background">
                    <option>Select category</option>
                    <option>DeFi</option>
                    <option>NFT</option>
                    <option>Gaming</option>
                    <option>Education</option>
                    <option>RWA</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Project Description</label>
                  <Textarea 
                    placeholder="Describe your project, its goals, and how it complies with Shariah principles..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Funding Goal (USD)</label>
                  <Input 
                    type="number"
                    placeholder="Enter funding goal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Campaign Duration (Days)</label>
                  <Input 
                    type="number"
                    placeholder="Enter duration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Required Documents</label>
                  <div className="space-y-2">
                    <div className="p-4 rounded-lg border-2 border-dashed border-border hover:border-purple-500/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Upload className="h-5 w-5" />
                        <span className="text-sm">Upload Business Plan</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border-2 border-dashed border-border hover:border-purple-500/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Upload className="h-5 w-5" />
                        <span className="text-sm">Upload Whitepaper</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border-2 border-dashed border-border hover:border-purple-500/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Upload className="h-5 w-5" />
                        <span className="text-sm">Upload Financial Projections</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border-2 border-dashed border-border hover:border-purple-500/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Upload className="h-5 w-5" />
                        <span className="text-sm">Upload Team Information</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-semibold text-amber-600 mb-1">Important Note</p>
                      <p>Your project will be reviewed by our Shariah board to ensure compliance with Islamic principles. This process typically takes 5-10 business days. You will be notified via email once the review is complete.</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Submit for Review
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Save as Draft
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

