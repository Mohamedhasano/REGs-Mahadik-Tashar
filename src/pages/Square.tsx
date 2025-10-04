import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Search, Bell, MessageCircle, Heart, Share, MoreHorizontal, TrendingUp, Users, BookOpen, Calendar, Send, Image, X, Plus, UserPlus, ExternalLink, Play, Clock, Star, Award, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timeAgo: string;
  likes: number;
}

interface Post {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  hashtags: string[];
  timeAgo: string;
  likes: number;
  comments: Comment[];
  shares: number;
  retweets: number;
  token?: {
    symbol: string;
    change: string;
    positive: boolean;
  };
  image?: string;
}

interface Trader {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  followers: number;
  following: boolean;
  bio: string;
  pnl: string;
  winRate: string;
  expertise: string[];
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  category: string;
  image?: string;
  readTime: string;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  level: string;
  duration: string;
  rating: number;
  students: number;
  thumbnail: string;
  description: string;
  price: string;
}

interface Moment {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'launch' | 'milestone' | 'announcement' | 'achievement';
  impact: 'high' | 'medium' | 'low';
}

interface SearchResult {
  id: string;
  type: 'post' | 'trader' | 'news' | 'course' | 'moment';
  title: string;
  subtitle?: string;
  description: string;
  badge?: string;
  data: Post | Trader | NewsItem | Course | Moment;
}

const mockTraders: Trader[] = [
  {
    id: "1",
    name: "Ahmed Al-Rashid",
    handle: "@ahmed_halal_trader",
    avatar: "/lovable-uploads/f002b26b-8d84-45c8-a0e1-443b640ed297.png",
    verified: true,
    followers: 15420,
    following: false,
    bio: "Sharia-compliant crypto analyst | 5+ years Islamic finance | Sidra Chain expert",
    pnl: "+247.8%",
    winRate: "73%",
    expertise: ["Islamic DeFi", "Halal Trading", "Risk Management"]
  },
  {
    id: "2", 
    name: "Fatima Hassan",
    handle: "@fatima_islamic_finance",
    avatar: "/lovable-uploads/f002b26b-8d84-45c8-a0e1-443b640ed297.png",
    verified: true,
    followers: 12850,
    following: true,
    bio: "Islamic finance educator | Author of 'Halal Crypto Guide' | Founder @HalalInvestAcademy",
    pnl: "+189.3%",
    winRate: "68%",
    expertise: ["Education", "Sharia Compliance", "Portfolio Management"]
  },
  {
    id: "3",
    name: "Omar Blockchain",
    handle: "@omar_sidra_dev",
    avatar: "/lovable-uploads/f002b26b-8d84-45c8-a0e1-443b640ed297.png",
    followers: 8420,
    following: false,
    bio: "Sidra Chain developer | Building halal DeFi solutions | Smart contract auditor",
    pnl: "+156.7%",
    winRate: "65%",
    expertise: ["Development", "Smart Contracts", "Security"]
  }
];

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Sidra Chain Launches First Sharia-Compliant DEX with $50M TVL",
    summary: "The revolutionary decentralized exchange introduces halal trading mechanisms compliant with Islamic finance principles, attracting major institutional investors.",
    source: "Islamic Finance Today",
    timeAgo: "2h",
    category: "DeFi",
    readTime: "3 min read"
  },
  {
    id: "2",
    title: "Malaysia's Central Bank Approves REGS for Digital Asset Framework",
    summary: "Bank Negara Malaysia grants preliminary approval for REGS token under new Sharia-compliant digital asset regulations.",
    source: "Crypto Halal News",
    timeAgo: "4h", 
    category: "Regulation",
    readTime: "5 min read"
  },
  {
    id: "3",
    title: "Islamic Development Bank Partners with Sidra Start for $100M Fund",
    summary: "Historic partnership aims to accelerate halal fintech adoption across 57 OIC member countries.",
    source: "Blockchain Islamic",
    timeAgo: "6h",
    category: "Partnership",
    readTime: "4 min read"
  }
];

const mockCourses: Course[] = [
  {
    id: "1",
    title: "Islamic Finance Fundamentals in Digital Assets",
    instructor: "Dr. Abdullah Al-Mansouri",
    level: "Beginner",
    duration: "6 weeks",
    rating: 4.8,
    students: 2847,
    thumbnail: "/lovable-uploads/f002b26b-8d84-45c8-a0e1-443b640ed297.png",
    description: "Learn the principles of Sharia-compliant investing in cryptocurrency and digital assets",
    price: "Free"
  },
  {
    id: "2",
    title: "Advanced Halal Trading Strategies",
    instructor: "Ustadh Muhammad Ibrahim",
    level: "Advanced",
    duration: "8 weeks",
    rating: 4.9,
    students: 1523,
    thumbnail: "/lovable-uploads/f002b26b-8d84-45c8-a0e1-443b640ed297.png",
    description: "Master complex Islamic trading techniques and risk management in volatile markets",
    price: "50 REGS"
  },
  {
    id: "3",
    title: "Sidra Chain DeFi Protocols",
    instructor: "Eng. Aisha Khalil",
    level: "Intermediate", 
    duration: "4 weeks",
    rating: 4.7,
    students: 934,
    thumbnail: "/lovable-uploads/f002b26b-8d84-45c8-a0e1-443b640ed297.png",
    description: "Deep dive into Sidra Chain's halal DeFi ecosystem and yield farming opportunities",
    price: "25 REGS"
  }
];

const mockMoments: Moment[] = [
  {
    id: "1",
    title: "REGS Global Launch",
    description: "Official launch of REGS as the first Tier-1 Sharia-compliant exchange",
    date: "Dec 15, 2024",
    type: "launch",
    impact: "high"
  },
  {
    id: "2", 
    title: "10,000 Halal Tokens Milestone",
    description: "REGS reaches milestone of listing 10,000+ Sharia-compliant digital assets",
    date: "Dec 10, 2024",
    type: "milestone",
    impact: "high"
  },
  {
    id: "3",
    title: "Sidra Start Initiative Announcement",
    description: "Launch of $1B fund to support Islamic fintech innovation globally",
    date: "Dec 5, 2024",
    type: "announcement", 
    impact: "high"
  },
  {
    id: "4",
    title: "1 Million Users Achievement",
    description: "REGS celebrates reaching 1 million verified Islamic finance users",
    date: "Nov 28, 2024",
    type: "achievement",
    impact: "medium"
  }
];

const mockPosts: Post[] = [
  {
    id: "1",
    user: {
      name: "Ahmed_Trader",
      handle: "@ahmed_crypto",
      avatar: "/lovable-uploads/f002b26b-8d84-45c8-a0e1-443b640ed297.png",
      verified: true
    },
    content: "REGS recent rally pushed prices above $0.0124, fueled by halal sentiment and broader Islamic finance momentum. However, excitement was tempered when REGS...",
    hashtags: ["#REGSRally", "#HalalTrading", "#SidraChain"],
    timeAgo: "4m",
    likes: 42,
    comments: [
      {
        id: "c1",
        user: { name: "Sarah_Halal", avatar: "/lovable-uploads/f002b26b-8d84-45c8-a0e1-443b640ed297.png" },
        content: "Great analysis! What's your target price for REGS?",
        timeAgo: "2m",
        likes: 5
      }
    ],
    shares: 12,
    retweets: 5,
    token: {
      symbol: "REGS",
      change: "+7.27%",
      positive: true
    }
  },
  {
    id: "2",
    user: {
      name: "FatimahCrypto",
      handle: "@fatimah_defi",
      avatar: "/lovable-uploads/f002b26b-8d84-45c8-a0e1-443b640ed297.png"
    },
    content: "$INIT hold or take profit...? Please suggest halal strategies for Sidra Chain ecosystem tokens 🤲",
    hashtags: ["#INIT", "#HalalInvestment", "#SidraEcosystem"],
    timeAgo: "2h",
    likes: 156,
    comments: [
      {
        id: "c2",
        user: { name: "Omar_Tech", avatar: "/lovable-uploads/f002b26b-8d84-45c8-a0e1-443b640ed297.png" },
        content: "I'd suggest taking some profit and keeping 60% for long term",
        timeAgo: "1h",
        likes: 12
      },
      {
        id: "c3", 
        user: { name: "Aisha_Investor", avatar: "/lovable-uploads/f002b26b-8d84-45c8-a0e1-443b640ed297.png" },
        content: "Always follow halal guidelines first, profit second!",
        timeAgo: "45m",
        likes: 8
      }
    ],
    shares: 28,
    retweets: 19,
    token: {
      symbol: "INIT",
      change: "+2.25%",
      positive: true
    }
  },
  {
    id: "3",
    user: {
      name: "Umar_Analytics",
      handle: "@umar_charts",
      avatar: "/lovable-uploads/f002b26b-8d84-45c8-a0e1-443b640ed297.png",
      verified: true
    },
    content: "Technical analysis shows strong support at $0.011 for REGS. The Islamic DeFi narrative is gaining traction across major markets. 📈",
    hashtags: ["#TechnicalAnalysis", "#IslamicDeFi", "#REGS"],
    timeAgo: "6h",
    likes: 89,
    comments: [],
    shares: 15,
    retweets: 8,
    token: {
      symbol: "REGS",
      change: "+4.12%",
      positive: true
    }
  }
];

const Square = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("discover");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostHashtags, setNewPostHashtags] = useState("");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [followingTraders, setFollowingTraders] = useState<Set<string>>(new Set(["2"]));
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handlePublishPost = () => {
    if (!newPostContent.trim()) return;

    const hashtags = newPostHashtags
      .split(' ')
      .filter(tag => tag.startsWith('#'))
      .slice(0, 5);

    const newPost: Post = {
      id: Date.now().toString(),
      user: {
        name: "You",
        handle: "@yourhandle",
        avatar: "/lovable-uploads/f002b26b-8d84-45c8-a0e1-443b640ed297.png",
        verified: false
      },
      content: newPostContent,
      hashtags: hashtags.length > 0 ? hashtags : ["#REGS"],
      timeAgo: "now",
      likes: 0,
      comments: [],
      shares: 0,
      retweets: 0
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent("");
    setNewPostHashtags("");
    setNewPostOpen(false);
    
    toast({
      title: "Post published!",
      description: "Your post has been shared with the REGS community"
    });
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleAddComment = (postId: string) => {
    const commentContent = newComments[postId];
    if (!commentContent?.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      user: {
        name: "You",
        avatar: "/lovable-uploads/f002b26b-8d84-45c8-a0e1-443b640ed297.png"
      },
      content: commentContent,
      timeAgo: "now",
      likes: 0
    };

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));

    setNewComments(prev => ({ ...prev, [postId]: "" }));
    
    toast({
      title: "Comment added!",
      description: "Your comment has been posted"
    });
  };

  const handleFollowTrader = (traderId: string) => {
    setFollowingTraders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(traderId)) {
        newSet.delete(traderId);
        toast({ title: "Unfollowed", description: "You are no longer following this trader" });
      } else {
        newSet.add(traderId);
        toast({ title: "Following", description: "You are now following this trader" });
      }
      return newSet;
    });
  };

  const handleEnrollCourse = (courseId: string) => {
    setEnrolledCourses(prev => {
      const newSet = new Set(prev);
      newSet.add(courseId);
      return newSet;
    });
    toast({ title: "Enrolled!", description: "You have enrolled in this course" });
  };

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    const results: SearchResult[] = [];
    const lowercaseQuery = query.toLowerCase();

    // Search posts
    posts.forEach(post => {
      const searchableText = `${post.content} ${post.hashtags.join(' ')} ${post.user.name} ${post.user.handle}`.toLowerCase();
      if (searchableText.includes(lowercaseQuery)) {
        results.push({
          id: `post-${post.id}`,
          type: 'post',
          title: post.user.name,
          subtitle: post.user.handle,
          description: post.content.slice(0, 100) + (post.content.length > 100 ? '...' : ''),
          badge: post.hashtags[0],
          data: post
        });
      }
    });

    // Search traders
    mockTraders.forEach(trader => {
      const searchableText = `${trader.name} ${trader.handle} ${trader.bio} ${trader.expertise.join(' ')}`.toLowerCase();
      if (searchableText.includes(lowercaseQuery)) {
        results.push({
          id: `trader-${trader.id}`,
          type: 'trader',
          title: trader.name,
          subtitle: trader.handle,
          description: trader.bio,
          badge: trader.verified ? 'Verified' : `${trader.followers.toLocaleString()} followers`,
          data: trader
        });
      }
    });

    // Search news
    mockNews.forEach(article => {
      const searchableText = `${article.title} ${article.summary} ${article.category} ${article.source}`.toLowerCase();
      if (searchableText.includes(lowercaseQuery)) {
        results.push({
          id: `news-${article.id}`,
          type: 'news',
          title: article.title,
          subtitle: `${article.source} • ${article.timeAgo}`,
          description: article.summary,
          badge: article.category,
          data: article
        });
      }
    });

    // Search courses
    mockCourses.forEach(course => {
      const searchableText = `${course.title} ${course.description} ${course.instructor} ${course.level}`.toLowerCase();
      if (searchableText.includes(lowercaseQuery)) {
        results.push({
          id: `course-${course.id}`,
          type: 'course',
          title: course.title,
          subtitle: `By ${course.instructor}`,
          description: course.description,
          badge: course.level,
          data: course
        });
      }
    });

    // Search moments
    mockMoments.forEach(moment => {
      const searchableText = `${moment.title} ${moment.description} ${moment.type}`.toLowerCase();
      if (searchableText.includes(lowercaseQuery)) {
        results.push({
          id: `moment-${moment.id}`,
          type: 'moment',
          title: moment.title,
          subtitle: moment.date,
          description: moment.description,
          badge: moment.type.charAt(0).toUpperCase() + moment.type.slice(1),
          data: moment
        });
      }
    });

    // Sort results by relevance (exact matches first)
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase().includes(lowercaseQuery) ? 1 : 0;
      const bExact = b.title.toLowerCase().includes(lowercaseQuery) ? 1 : 0;
      return bExact - aExact;
    });

    setTimeout(() => {
      setSearchResults(results.slice(0, 50)); // Limit to 50 results
      setSearchLoading(false);
    }, 300); // Simulate API delay
  };

  const handleSearchOpen = () => {
    setSearchOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'post':
        setActiveTab('discover');
        handleSearchClose();
        break;
      case 'trader':
        setActiveTab('following');
        handleSearchClose();
        break;
      case 'news':
        setActiveTab('news');
        handleSearchClose();
        break;
      case 'course':
        setActiveTab('academy');
        handleSearchClose();
        break;
      case 'moment':
        setActiveTab('moments');
        handleSearchClose();
        break;
    }
    
    toast({
      title: "Navigated",
      description: `Switched to ${result.type} section`
    });
  };

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-accent rounded-lg transition-all duration-200 hover:scale-110"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">R</span>
            </div>
            <h1 className="text-lg font-bold">
              <span className="text-primary">REGS</span> SQUARE
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSearchOpen}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-accent rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 animate-fade-in">
          <div className="max-w-2xl mx-auto">
            {/* Search Header */}
            <div className="flex items-center gap-3 p-4 border-b">
              <button 
                onClick={handleSearchClose}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts, traders, news, courses..."
                  className="pl-10 pr-4 w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-accent rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
              {searchLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Searching...</p>
                </div>
              ) : searchQuery && searchResults.length === 0 ? (
                <div className="p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">Try different keywords or check spelling</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-0">
                  {searchResults.map((result, index) => (
                    <Card 
                      key={result.id}
                      className="rounded-none border-x-0 border-t-0 hover:bg-accent/5 transition-colors cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => handleSearchResultClick(result)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            {result.type === 'post' && <MessageCircle className="h-5 w-5 text-primary" />}
                            {result.type === 'trader' && <Users className="h-5 w-5 text-primary" />}
                            {result.type === 'news' && <BookOpen className="h-5 w-5 text-primary" />}
                            {result.type === 'course' && <Play className="h-5 w-5 text-primary" />}
                            {result.type === 'moment' && <Calendar className="h-5 w-5 text-primary" />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm truncate">{result.title}</h3>
                              {result.badge && (
                                <Badge variant="outline" className="text-xs shrink-0">
                                  {result.badge}
                                </Badge>
                              )}
                            </div>
                            {result.subtitle && (
                              <p className="text-xs text-muted-foreground mb-1">{result.subtitle}</p>
                            )}
                            <p className="text-sm text-foreground/80 line-clamp-2">{result.description}</p>
                          </div>
                          
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="p-8">
                  <h3 className="text-lg font-semibold mb-4">Quick Search</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {["#REGS", "#HalalTrading", "#IslamicDeFi", "#SidraChain"].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className="p-3 text-left border rounded-lg hover:bg-accent transition-colors"
                      >
                        <span className="text-sm font-medium">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3 text-muted-foreground">Recent Searches</h4>
                    <div className="space-y-2">
                      {["Islamic finance news", "halal trading strategies", "REGS price"].map((recent) => (
                        <button
                          key={recent}
                          onClick={() => setSearchQuery(recent)}
                          className="flex items-center gap-2 p-2 hover:bg-accent rounded-lg transition-colors w-full text-left"
                        >
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{recent}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b bg-background/50 backdrop-blur-sm sticky top-[73px] z-40">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-12 grid grid-cols-5 bg-transparent border-0 rounded-none">
            <TabsTrigger 
              value="discover" 
              className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Discover</span>
            </TabsTrigger>
            <TabsTrigger 
              value="following" 
              className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Following</span>
            </TabsTrigger>
            <TabsTrigger 
              value="news" 
              className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
            >
              <span className="hidden sm:inline">News</span>
              <span className="sm:hidden">📰</span>
            </TabsTrigger>
            <TabsTrigger 
              value="academy" 
              className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Academy</span>
            </TabsTrigger>
            <TabsTrigger 
              value="moments" 
              className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Moments</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="discover" className="mt-0 space-y-0">
            {posts.map((post, index) => (
              <Card 
                key={post.id} 
                className="rounded-none border-x-0 border-t-0 animate-fade-in hover:bg-accent/5 transition-colors cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.user.avatar} alt={post.user.name} />
                        <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{post.user.name}</span>
                          {post.user.verified && (
                            <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-primary text-primary-foreground">
                              ✓
                            </Badge>
                          )}
                          <span className="text-muted-foreground text-sm">{post.timeAgo}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">{post.user.handle}</span>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-accent rounded-full transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-3">
                    {/* Hashtags */}
                    <div className="flex gap-2 flex-wrap">
                      {post.hashtags.map((tag) => (
                        <span key={tag} className="text-primary font-medium text-sm hover:underline cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Text Content */}
                    <p className="text-sm leading-relaxed">{post.content}</p>

                    {/* Token Info */}
                    {post.token && (
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                        <Badge variant="outline" className="font-mono">
                          {post.token.symbol}
                        </Badge>
                        <span className={`text-sm font-medium ${
                          post.token.positive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {post.token.change}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Engagement Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <button 
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">{formatNumber(post.comments.length)}</span>
                    </button>

                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 transition-colors group ${
                        likedPosts.has(post.id) 
                          ? 'text-red-500' 
                          : 'text-muted-foreground hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 group-hover:scale-110 transition-transform ${
                        likedPosts.has(post.id) ? 'fill-current' : ''
                      }`} />
                      <span className="text-sm">
                        {formatNumber(post.likes + (likedPosts.has(post.id) ? 1 : 0))}
                      </span>
                    </button>

                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                      <Share className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">{formatNumber(post.retweets)}</span>
                    </button>

                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                      <span className="text-sm">{formatNumber(post.shares)}</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {expandedComments.has(post.id) && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {/* Existing Comments */}
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 animate-fade-in">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-muted/50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{comment.user.name}</span>
                                <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-1 ml-3">
                              <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {comment.likes > 0 && <span>{comment.likes}</span>}
                              </button>
                              <button className="text-xs text-muted-foreground hover:text-foreground">
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add Comment */}
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>Y</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Input
                            placeholder="Add a comment..."
                            value={newComments[post.id] || ""}
                            onChange={(e) => setNewComments(prev => ({ 
                              ...prev, 
                              [post.id]: e.target.value 
                            }))}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddComment(post.id);
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleAddComment(post.id)}
                            disabled={!newComments[post.id]?.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="following" className="mt-0">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="p-4 border-b bg-background/50 backdrop-blur-sm sticky top-[125px] z-30">
                <h2 className="text-lg font-semibold mb-2">Discover Islamic Finance Experts</h2>
                <p className="text-sm text-muted-foreground">Follow Sharia-compliant traders and educators</p>
              </div>

              {/* Suggested Traders */}
              <div className="space-y-0">
                {mockTraders.map((trader, index) => (
                  <Card 
                    key={trader.id} 
                    className="rounded-none border-x-0 border-t-0 animate-fade-in hover:bg-accent/5 transition-colors"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Avatar and Basic Info */}
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={trader.avatar} alt={trader.name} />
                            <AvatarFallback>{trader.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm truncate">{trader.name}</h3>
                              {trader.verified && (
                                <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-primary text-primary-foreground">
                                  ✓
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{trader.handle}</p>
                            <p className="text-xs text-foreground/80 mb-2 line-clamp-2">{trader.bio}</p>
                            
                            {/* Stats */}
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-muted-foreground">
                                {trader.followers.toLocaleString()} followers
                              </span>
                              <span className="text-green-600 font-medium">
                                PnL: {trader.pnl}
                              </span>
                              <span className="text-blue-600 font-medium">
                                Win Rate: {trader.winRate}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Follow Button */}
                        <Button
                          variant={followingTraders.has(trader.id) ? "secondary" : "default"}
                          size="sm"
                          onClick={() => handleFollowTrader(trader.id)}
                          className="shrink-0"
                        >
                          {followingTraders.has(trader.id) ? (
                            <>
                              <Users className="h-3 w-3 mr-1" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-3 w-3 mr-1" />
                              Follow
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Expertise Tags */}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {trader.expertise.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Following Feed */}
              {followingTraders.size > 0 && (
                <div className="mt-6">
                  <div className="p-4 bg-accent/10 border-y">
                    <h3 className="font-semibold mb-2">Latest from people you follow</h3>
                  </div>
                  <div className="text-center p-8 text-muted-foreground">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>Posts from followed traders will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-0">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="p-4 border-b bg-background/50 backdrop-blur-sm sticky top-[125px] z-30">
                <h2 className="text-lg font-semibold mb-2">Islamic Finance News</h2>
                <p className="text-sm text-muted-foreground">Stay updated with halal market developments</p>
              </div>

              {/* News Categories */}
              <div className="flex gap-2 p-4 border-b overflow-x-auto">
                {["All", "DeFi", "Regulation", "Partnership", "Technology"].map((category) => (
                  <Badge 
                    key={category} 
                    variant={category === "All" ? "default" : "outline"}
                    className="whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {category}
                  </Badge>
                ))}
              </div>

              {/* News Articles */}
              <div className="space-y-0">
                {mockNews.map((article, index) => (
                  <Card 
                    key={article.id} 
                    className="rounded-none border-x-0 border-t-0 animate-fade-in hover:bg-accent/5 transition-colors cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{article.source}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{article.timeAgo}</span>
                          </div>
                          
                          <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {article.summary}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {article.readTime}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Read
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Share className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Placeholder for article image */}
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center shrink-0">
                          <BookOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="p-4 text-center">
                <Button variant="outline" className="w-full">
                  Load More Articles
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="academy" className="mt-0">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="p-4 border-b bg-background/50 backdrop-blur-sm sticky top-[125px] z-30">
                <h2 className="text-lg font-semibold mb-2">Islamic Trading Academy</h2>
                <p className="text-sm text-muted-foreground">Master Sharia-compliant investment strategies</p>
              </div>

              {/* Course Categories */}
              <div className="flex gap-2 p-4 border-b overflow-x-auto">
                {["All Courses", "Beginner", "Intermediate", "Advanced", "Free"].map((level) => (
                  <Badge 
                    key={level} 
                    variant={level === "All Courses" ? "default" : "outline"}
                    className="whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {level}
                  </Badge>
                ))}
              </div>

              {/* Featured Course */}
              <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Featured Course</span>
                </div>
                <h3 className="font-semibold mb-1">Complete Islamic Finance Masterclass</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  From basics to advanced halal trading strategies
                </p>
                <Button size="sm" className="mt-2">
                  <Play className="h-3 w-3 mr-1" />
                  Start Learning
                </Button>
              </div>

              {/* Course List */}
              <div className="space-y-0">
                {mockCourses.map((course, index) => (
                  <Card 
                    key={course.id} 
                    className="rounded-none border-x-0 border-t-0 animate-fade-in hover:bg-accent/5 transition-colors"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Course Thumbnail */}
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center shrink-0">
                          <BookOpen className="h-8 w-8 text-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                                {course.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mb-1">
                                By {course.instructor}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs ml-2 shrink-0">
                              {course.level}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-foreground/80 mb-2 line-clamp-2">
                            {course.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {course.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current text-yellow-500" />
                              {course.rating}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {course.students.toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-primary">
                              {course.price}
                            </span>
                            <Button 
                              size="sm" 
                              variant={enrolledCourses.has(course.id) ? "secondary" : "default"}
                              onClick={() => handleEnrollCourse(course.id)}
                              disabled={enrolledCourses.has(course.id)}
                            >
                              {enrolledCourses.has(course.id) ? (
                                <>
                                  <Award className="h-3 w-3 mr-1" />
                                  Enrolled
                                </>
                              ) : (
                                <>
                                  <Plus className="h-3 w-3 mr-1" />
                                  Enroll
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Academy Stats */}
              <div className="p-4 bg-muted/30 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary">50+</div>
                    <div className="text-xs text-muted-foreground">Courses</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">15,000+</div>
                    <div className="text-xs text-muted-foreground">Students</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">4.8★</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="moments" className="mt-0">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="p-4 border-b bg-background/50 backdrop-blur-sm sticky top-[125px] z-30">
                <h2 className="text-lg font-semibold mb-2">Market Moments</h2>
                <p className="text-sm text-muted-foreground">Key milestones in Islamic finance history</p>
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
                
                {mockMoments.map((moment, index) => (
                  <div 
                    key={moment.id}
                    className="relative pl-16 pb-8 animate-fade-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-6 w-4 h-4 rounded-full border-2 border-background ${
                      moment.impact === 'high' ? 'bg-primary' :
                      moment.impact === 'medium' ? 'bg-accent' : 'bg-muted-foreground'
                    }`}></div>
                    
                    <Card className="hover:shadow-md transition-all duration-200 hover-scale">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                moment.type === 'launch' ? 'border-green-500 text-green-600' :
                                moment.type === 'milestone' ? 'border-blue-500 text-blue-600' :
                                moment.type === 'announcement' ? 'border-purple-500 text-purple-600' :
                                'border-orange-500 text-orange-600'
                              }`}
                            >
                              {moment.type.charAt(0).toUpperCase() + moment.type.slice(1)}
                            </Badge>
                            <Badge 
                              variant={moment.impact === 'high' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {moment.impact.toUpperCase()} IMPACT
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {moment.date}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-sm mb-2">
                          {moment.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {moment.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {Math.floor(Math.random() * 500) + 100}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share className="h-3 w-3" />
                              {Math.floor(Math.random() * 100) + 20}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <ChevronRight className="h-3 w-3 ml-1" />
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="p-4 text-center">
                <Button variant="outline" className="w-full">
                  Load Earlier Moments
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center z-30">
            <span className="text-2xl font-bold">+</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <span className="text-sm font-medium">You</span>
                <span className="text-xs text-muted-foreground ml-2">@yourhandle</span>
              </div>
            </div>
            
            <Textarea
              placeholder="What's happening in the Islamic finance world?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[120px] resize-none border-0 p-0 focus-visible:ring-0"
              maxLength={280}
            />
            
            <Input
              placeholder="Add hashtags (e.g., #REGS #HalalTrading)"
              value={newPostHashtags}
              onChange={(e) => setNewPostHashtags(e.target.value)}
              className="border-0 border-t border-border rounded-none px-0"
            />
            
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {280 - newPostContent.length}
                </span>
                <Button
                  onClick={handlePublishPost}
                  disabled={!newPostContent.trim()}
                  className="rounded-full"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Square;
