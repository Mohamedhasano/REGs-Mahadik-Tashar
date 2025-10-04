import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import {
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  ChevronRight,
  Settings,
  Gift,
  UserPlus,
  Square,
  Coins,
  Rocket,
  Users,
  ShieldCheck,
  Shield,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Wallet,
  LogOut,
  Edit,
  Mail,
  Phone,
  Globe,
  Lock,
  Smartphone,
  CreditCard,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import api from "@/lib/api";

interface VIPData {
  vipLevel: string;
  vipTradingVolume30Days: number;
  vipTotalTradingVolume: number;
  vipBenefits: {
    tradingFeeDiscount: number;
    withdrawalFeeDiscount: number;
    dailyWithdrawalLimit: number;
    prioritySupport: boolean;
    exclusiveEvents: boolean;
    advancedAnalytics: boolean;
    customAPI: boolean;
    dedicatedManager: boolean;
  };
  vipProgress: {
    currentLevel: string;
    tradingVolume30Days: number;
    nextLevelRequirement: number;
    progressPercentage: number;
    benefitsUnlocked: string[];
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [emailVisible, setEmailVisible] = useState(false);
  const [vipData, setVipData] = useState<VIPData | null>(null);
  const [loadingVIP, setLoadingVIP] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    document.title = `${user?.name || 'Profile'} — REGs Global`;
  }, [user]);

  // Load VIP status from API (محفوظ للأبد!)
  useEffect(() => {
    const loadVIPStatus = async () => {
      try {
        setLoadingVIP(true);
        const response = await api.get('/vip/status');
        setVipData(response.data);
      } catch (error) {
        console.error('Error loading VIP status:', error);
      } finally {
        setLoadingVIP(false);
      }
    };

    if (user) {
      loadVIPStatus();
    }
  }, [user]);

  const handleCopyUID = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      toast.success('User ID copied to clipboard!');
    }
  };

  const handleCopyEmail = () => {
    if (user?.email) {
      navigator.clipboard.writeText(user.email);
      toast.success('Email copied to clipboard!');
    }
  };

  const handleCopyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast.success('Referral code copied!');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getKYCProgress = () => {
    switch (user?.kycStatus) {
      case 'approved': return 100;
      case 'under_review': return 66;
      case 'rejected': return 33;
      default: return 0;
    }
  };

  const getKYCLevel = () => {
    switch (user?.kycStatus) {
      case 'approved': return 'Level 3';
      case 'under_review': return 'Level 2';
      case 'rejected': return 'Level 1';
      default: return 'Not Started';
    }
  };

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const shortcuts = [
    { label: "Megadrop", icon: Gift, path: "/megadrop" },
    { label: "Referral", icon: UserPlus, path: "/referral" },
    { label: "Square", icon: Square, path: "/square" },
    { label: "Earn", icon: Coins, path: "/earn" },
    { label: "Launchpool", icon: Rocket, path: "/megadrop" },
    { label: "P2P", icon: Users, path: "/p2p" },
    { label: "Edit", icon: Edit, path: "/profile" },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Account Info</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-full"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* User Info Card */}
        <Card className="p-6 mb-6 border-2">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-amber-500/30">
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white text-xl font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                {user.kycStatus === 'approved' && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center border-2 border-background">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <Badge variant="secondary" className="text-xs">
                    {user.role === 'trader' ? 'Regular' : user.role}
                  </Badge>
                  {user.kycStatus === 'approved' && (
                    <Badge variant="default" className="bg-emerald-600 text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  ID: {user.id.substring(0, 8)}...
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/profile')}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>

          {/* User Details */}
          <div className="space-y-3">
            {/* User ID */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-muted-foreground">User ID (UID)</div>
                  <div className="font-mono font-semibold">{user.id}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyUID}
                className="h-8 w-8"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3 flex-1">
                <Mail className="h-5 w-5 text-emerald-500" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Registration Info</div>
                  <div className="font-semibold">
                    {emailVisible ? user.email : user.email.replace(/(.{3})(.*)(@.*)/, '$1***$3')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEmailVisible(!emailVisible)}
                  className="h-8 w-8"
                >
                  {emailVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyEmail}
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Referral Code */}
            {user.referralCode && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <Gift className="h-5 w-5 text-amber-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Referral Code</div>
                    <div className="font-mono font-bold text-lg text-amber-600">
                      {user.referralCode}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyReferralCode}
                  className="border-amber-500/30"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* VIP Status (حقيقي من Backend!) */}
        <Card className="p-6 mb-6 border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-yellow-500/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                {loadingVIP ? (
                  'Loading VIP Status...'
                ) : (
                  <>
                    <span className="text-amber-600">{vipData?.vipLevel || 'Regular'}</span>
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-700">
                      Real-time
                    </Badge>
                  </>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {loadingVIP 
                  ? 'Fetching from database...'
                  : vipData?.vipLevel === 'Regular' 
                  ? 'Trade more to reach VIP1' 
                  : `Keep trading to maintain ${vipData?.vipLevel}`
                }
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (vipData?.vipProgress?.benefitsUnlocked) {
                  const benefits = vipData.vipProgress.benefitsUnlocked.join('\n• ');
                  toast.success(`Your Benefits:\n• ${benefits}`);
                } else {
                  toast.info('Loading benefits...');
                }
              }}
            >
              Benefits
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            </div>

          {!loadingVIP && vipData && (
            <>
              <Progress 
                value={vipData.vipProgress.progressPercentage} 
                className="h-2" 
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  ${vipData.vipProgress.tradingVolume30Days.toLocaleString()} / ${vipData.vipProgress.nextLevelRequirement.toLocaleString()} trading volume (30 days)
                </p>
                <p className="text-xs font-semibold text-amber-600">
                  {vipData.vipProgress.progressPercentage.toFixed(0)}%
                </p>
              </div>
              
              {/* Real-time benefits */}
              <div className="mt-4 p-3 bg-background rounded-lg">
                <div className="text-xs font-semibold mb-2 text-muted-foreground">Current Benefits:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-emerald-600" />
                    <span>{vipData.vipBenefits.tradingFeeDiscount}% Trading Fee Off</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-emerald-600" />
                    <span>${vipData.vipBenefits.dailyWithdrawalLimit.toLocaleString()} Daily Limit</span>
                  </div>
                  {vipData.vipBenefits.prioritySupport && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                      <span>Priority Support</span>
                    </div>
                  )}
                  {vipData.vipBenefits.exclusiveEvents && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                      <span>Exclusive Events</span>
                    </div>
                  )}
                </div>
            </div>

              {/* Total trading volume */}
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total Trading Volume (All Time):</span>
                  <span className="font-bold text-amber-600">${vipData.vipTotalTradingVolume.toLocaleString()}</span>
                </div>
              </div>
            </>
          )}
          
          {loadingVIP && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
            </div>
          )}
        </Card>

        {/* Verifications */}
        <Card
          className="p-6 mb-4 cursor-pointer hover:shadow-lg transition-all border-2"
          onClick={() => navigate('/verifications')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Verifications</h3>
                <p className="text-sm text-muted-foreground">
                  {user.kycStatus === 'approved' 
                    ? 'Fully verified account' 
                    : 'Complete your verification'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user.kycStatus === 'approved' ? (
                <Badge variant="default" className="bg-emerald-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              )}
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <Separator className="my-4" />

          {/* KYC Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">KYC Progress</span>
              <span className="text-sm font-semibold">{getKYCLevel()}</span>
            </div>
            <Progress value={getKYCProgress()} className="h-2" />
            
            {user.kycStatus !== 'approved' && (
              <Button 
                className="w-full mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/kyc-verification');
                }}
              >
                Complete Profile Verification
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>

        {/* Security */}
        <Card
          className="p-6 mb-4 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => navigate('/verifications')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Security</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your account security
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>

        {/* Twitter (if you want to keep it) */}
        <Card
          className="p-6 mb-6 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => toast.info('Social linking coming soon!')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Twitter</h3>
                <p className="text-sm text-muted-foreground">
                  Link your social accounts
                </p>
              </div>
            </div>
            <Badge variant="outline">
              Unlinked
            </Badge>
          </div>
        </Card>

        {/* Shortcuts */}
        <Card className="p-6 mb-6">
          <h3 className="font-bold text-lg mb-4">Shortcut</h3>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
            {shortcuts.map((item) => (
              <button
                key={item.label}
                onClick={() => item.path && navigate(item.path)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Recommend */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Recommend</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "New Listing Promos", icon: TrendingUp, path: "/markets" },
              { label: "Alpha Events", icon: Rocket, path: "/megadrop" },
              { label: "Simple Earn", icon: Coins, path: "/earn" },
              { label: "Referral", icon: UserPlus, path: "/referral" },
              { label: "Square", icon: Square, path: "/square" },
              { label: "P2P", icon: Users, path: "/p2p" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-muted/30 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-left">{item.label}</span>
              </button>
            ))}
          </div>

          <Separator className="my-4" />

          <Button
            variant="outline"
            className="w-full"
            onClick={() => toast.info('More services coming soon!')}
          >
            More Services
          </Button>
        </Card>

        {/* Referral Stats (if user has referrals) */}
        {(user.referralCount && user.referralCount > 0) && (
          <Card className="p-6 mt-6 border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-yellow-500/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Referral Earnings</h3>
                  <p className="text-sm text-muted-foreground">
                    Invite friends and earn rewards
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-background">
                <div className="text-sm text-muted-foreground mb-1">Total Earnings</div>
                <div className="text-2xl font-bold text-emerald-600">
                  ${user.referralEarnings || 0}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background">
                <div className="text-sm text-muted-foreground mb-1">Total Referrals</div>
                <div className="text-2xl font-bold text-amber-600">
                  {user.referralCount}
                </div>
            </div>
            </div>

            <Button
              className="w-full mt-4"
              onClick={() => navigate('/referral')}
            >
              View Referral Program
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Card>
        )}
          </div>
    </div>
  );
}
