import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Users,
  BookOpen,
  FileText,
  Home,
  LogOut,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function SupportDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'support') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data
  const stats = {
    openTickets: 45,
    resolvedToday: 28,
    avgResponseTime: '12m',
    satisfaction: '4.8/5'
  };

  const tickets = [
    {
      id: '#TKT-001',
      user: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      subject: 'Deposit not showing in wallet',
      status: 'open',
      priority: 'high',
      created: '5 min ago',
      lastReply: 'No reply yet'
    },
    {
      id: '#TKT-002',
      user: 'Sara Ali',
      email: 'sara@example.com',
      subject: 'KYC verification taking too long',
      status: 'in_progress',
      priority: 'medium',
      created: '2 hours ago',
      lastReply: '30 min ago'
    },
    {
      id: '#TKT-003',
      user: 'Omar Khan',
      email: 'omar@example.com',
      subject: 'Question about Zakat calculation',
      status: 'open',
      priority: 'low',
      created: '1 day ago',
      lastReply: 'No reply yet'
    },
  ];

  const forumTopics = [
    {
      id: 'FORUM-001',
      title: 'Best halal crypto for long-term investment?',
      author: 'Mohammed Ali',
      category: 'Investment',
      replies: 15,
      views: 234,
      lastActivity: '2 hours ago',
      status: 'active'
    },
    {
      id: 'FORUM-002',
      title: 'How to calculate Zakat on crypto assets?',
      author: 'Fatima Ahmed',
      category: 'Islamic Finance',
      replies: 23,
      views: 456,
      lastActivity: '5 hours ago',
      status: 'active'
    },
  ];

  const announcements = [
    {
      id: 'ANN-001',
      title: 'New Halal Token Listing: Polygon (MATIC)',
      date: '2024-01-20',
      status: 'published',
      views: 1234
    },
    {
      id: 'ANN-002',
      title: 'Scheduled Maintenance - Jan 25, 2024',
      date: '2024-01-19',
      status: 'published',
      views: 856
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
              <div className="text-xs text-blue-600 font-semibold">Support Team Dashboard</div>
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
              <h1 className="text-3xl font-bold mb-2">Support Dashboard 💬</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
            <Badge variant="outline" className="text-sm px-4 py-2 border-blue-500 text-blue-600">
              <MessageSquare className="h-4 w-4 mr-2" />
              Support Agent
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Open Tickets</span>
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.openTickets}</div>
            <div className="text-sm text-amber-500">Needs attention</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Resolved Today</span>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.resolvedToday}</div>
            <div className="text-sm text-emerald-500">Great work!</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Avg Response</span>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.avgResponseTime}</div>
            <div className="text-sm text-blue-500">Response time</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Satisfaction</span>
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.satisfaction}</div>
            <div className="text-sm text-purple-500">Customer rating</div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="forum">Forum Management</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="education">Education Content</TabsTrigger>
          </TabsList>

          {/* Support Tickets */}
          <TabsContent value="tickets">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Support Tickets</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button size="sm" variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="p-6 border-2 hover:border-blue-500/30 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {ticket.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{ticket.id}</span>
                            <Badge variant={
                              ticket.priority === 'high' ? 'destructive' :
                              ticket.priority === 'medium' ? 'secondary' : 'outline'
                            }>
                              {ticket.priority}
                            </Badge>
                            <Badge variant={
                              ticket.status === 'open' ? 'secondary' :
                              ticket.status === 'in_progress' ? 'default' : 'outline'
                            }>
                              {ticket.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <h3 className="font-bold">{ticket.subject}</h3>
                          <div className="text-sm text-muted-foreground mt-1">
                            {ticket.user} ({ticket.email}) • Created {ticket.created}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground mb-4">
                      Last reply: {ticket.lastReply}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" className="flex-1">
                        <Send className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {ticket.status === 'open' && (
                        <Button size="sm" variant="outline">
                          Assign to Me
                        </Button>
                      )}
                      {ticket.status === 'in_progress' && (
                        <Button size="sm" variant="outline" className="text-emerald-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Forum Management */}
          <TabsContent value="forum">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Community Forum</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Topic
                </Button>
              </div>

              <div className="space-y-4">
                {forumTopics.map((topic) => (
                  <Card key={topic.id} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold">{topic.title}</h3>
                          <Badge variant="secondary">{topic.category}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Started by {topic.author} • {topic.lastActivity}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-emerald-600">
                        {topic.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {topic.replies} replies
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {topic.views} views
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        View Thread
                      </Button>
                      <Button size="sm" variant="outline">
                        Moderate
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500">
                        Close Thread
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Announcements */}
          <TabsContent value="announcements">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Announcements</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold mb-1">{announcement.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          Published on {new Date(announcement.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} • {announcement.views} views
                        </div>
                      </div>
                      <Badge variant="outline" className="text-emerald-600">
                        {announcement.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500">
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-6 border-2 border-dashed">
                <h3 className="font-bold mb-4">Create New Announcement</h3>
                <div className="space-y-4">
                  <Input placeholder="Announcement title..." />
                  <Textarea placeholder="Write your announcement content..." className="min-h-[150px]" />
                  <div className="flex items-center gap-2">
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Publish Announcement
                    </Button>
                    <Button variant="outline">
                      Save as Draft
                    </Button>
                  </div>
                </div>
              </Card>
            </Card>
          </TabsContent>

          {/* Education Content */}
          <TabsContent value="education">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Education Center Content</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-2 border-dashed hover:border-blue-500/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">Trading Guides</h3>
                      <p className="text-sm text-muted-foreground">24 articles</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Manage Content
                  </Button>
                </Card>

                <Card className="p-6 border-2 border-dashed hover:border-emerald-500/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">Islamic Finance</h3>
                      <p className="text-sm text-muted-foreground">18 articles</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Manage Content
                  </Button>
                </Card>

                <Card className="p-6 border-2 border-dashed hover:border-amber-500/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">FAQs</h3>
                      <p className="text-sm text-muted-foreground">45 questions</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Manage Content
                  </Button>
                </Card>

                <Card className="p-6 border-2 border-dashed hover:border-purple-500/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">Video Tutorials</h3>
                      <p className="text-sm text-muted-foreground">12 videos</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Manage Content
                  </Button>
                </Card>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

