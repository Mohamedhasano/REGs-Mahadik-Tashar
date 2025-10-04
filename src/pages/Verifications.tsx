import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  ShieldCheck,
  ChevronRight,
  Lock,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Key,
  Smartphone,
  Twitter,
  Facebook,
  Instagram,
  Globe,
  Home,
  LogOut,
  Edit,
  Link as LinkIcon,
  Loader2,
  QrCode,
  Copy
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { toast } from 'sonner';

export default function Verifications() {
  const navigate = useNavigate();
  const { user, logout, setAuth } = useAuthStore();
  
  // Real verification states linked to backend
  const [verifications, setVerifications] = useState({
    kyc: {
      status: user?.kycStatus || 'pending',
      level: user?.kycLevel || 0,
      verified: user?.kycStatus === 'approved',
      lastUpdate: '2024-01-20'
    },
    email: {
      verified: user?.isVerified || false,
      email: user?.email || '',
      lastVerified: '2024-01-15'
    },
    phone: {
      verified: false,
      number: '',
      lastVerified: null
    },
    twoFactor: {
      enabled: false,
      method: 'app', // 'app', 'sms', 'email'
      lastUsed: null,
      enabledAt: null
    },
    social: {
      twitter: { linked: false, username: '' },
      facebook: { linked: false, username: '' },
      instagram: { linked: false, username: '' },
      website: { linked: false, url: '' }
    }
  });

  // 2FA Setup states
  const [loading2FA, setLoading2FA] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFAData, setTwoFAData] = useState<{
    secret: string;
    qrCodeUrl: string;
    backupCodes: string[];
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');

  // Password Change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordInfo, setPasswordInfo] = useState<{
    lastChanged: string;
    daysSinceChange: number;
  } | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Login Sessions states
  const [showSessions, setShowSessions] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsCount, setSessionsCount] = useState(0);

  // Social Media states
  const [showSocialDialog, setShowSocialDialog] = useState(false);
  const [currentSocialPlatform, setCurrentSocialPlatform] = useState<'twitter' | 'facebook' | 'instagram' | 'website' | null>(null);
  const [socialUrl, setSocialUrl] = useState('');
  const [loadingSocial, setLoadingSocial] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    twitter: '',
    facebook: '',
    instagram: '',
    website: ''
  });

  // Load 2FA status, password info, sessions, and social links on mount
  useEffect(() => {
    load2FAStatus();
    loadPasswordInfo();
    loadSessions();
    loadSocialLinks();
  }, []);

  const load2FAStatus = async () => {
    try {
      const response = await api.get('/2fa/status');
      setVerifications(prev => ({
        ...prev,
        twoFactor: {
          ...prev.twoFactor,
          enabled: response.data.enabled,
          enabledAt: response.data.enabledAt
        }
      }));
    } catch (error: any) {
      console.error('Error loading 2FA status:', error);
    }
  };

  const loadPasswordInfo = async () => {
    try {
      const response = await api.get('/password/info');
      setPasswordInfo({
        lastChanged: response.data.lastChanged,
        daysSinceChange: response.data.daysSinceChange
      });
    } catch (error: any) {
      console.error('Error loading password info:', error);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await api.get('/sessions');
      setSessions(response.data.sessions || []);
      setSessionsCount(response.data.total || 0);
    } catch (error: any) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    if (!window.confirm('Are you sure you want to logout from this device?')) {
      return;
    }

    try {
      setLoadingSessions(true);
      await api.delete(`/sessions/${sessionId}`);
      await loadSessions(); // Reload sessions
      toast.success('✅ Logged out from device successfully');
    } catch (error: any) {
      console.error('Error logging out session:', error);
      toast.error(error.response?.data?.message || 'Failed to logout from device');
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleLogoutAllSessions = async () => {
    if (!window.confirm('Are you sure you want to logout from ALL other devices? This will keep only your current device logged in.')) {
      return;
    }

    try {
      setLoadingSessions(true);
      const response = await api.post('/sessions/logout-all');
      await loadSessions(); // Reload sessions
      toast.success(response.data.message || '✅ Logged out from all devices');
    } catch (error: any) {
      console.error('Error logging out all sessions:', error);
      toast.error(error.response?.data?.message || 'Failed to logout from devices');
    } finally {
      setLoadingSessions(false);
    }
  };

  const loadSocialLinks = async () => {
    try {
      const response = await api.get('/social-links');
      setSocialLinks(response.data.socialLinks || {
        twitter: '',
        facebook: '',
        instagram: '',
        website: ''
      });
      
      // Update verifications state
      setVerifications(prev => ({
        ...prev,
        social: {
          twitter: { 
            linked: !!response.data.socialLinks?.twitter, 
            username: response.data.socialLinks?.twitter ? new URL(response.data.socialLinks.twitter).pathname.split('/').pop() || '' : '' 
          },
          facebook: { 
            linked: !!response.data.socialLinks?.facebook, 
            username: response.data.socialLinks?.facebook ? new URL(response.data.socialLinks.facebook).pathname.split('/').pop() || '' : '' 
          },
          instagram: { 
            linked: !!response.data.socialLinks?.instagram, 
            username: response.data.socialLinks?.instagram ? new URL(response.data.socialLinks.instagram).pathname.split('/').pop() || '' : '' 
          },
          website: { 
            linked: !!response.data.socialLinks?.website, 
            url: response.data.socialLinks?.website || '' 
          }
        }
      }));
    } catch (error: any) {
      console.error('Error loading social links:', error);
    }
  };

  const handleLinkSocial = (platform: 'twitter' | 'facebook' | 'instagram' | 'website') => {
    setCurrentSocialPlatform(platform);
    setSocialUrl(socialLinks[platform] || '');
    setShowSocialDialog(true);
  };

  const handleSaveSocialLink = async () => {
    if (!currentSocialPlatform) return;

    // Basic URL validation
    if (socialUrl && !socialUrl.startsWith('http://') && !socialUrl.startsWith('https://')) {
      toast.error('Please enter a valid URL starting with http:// or https://');
      return;
    }

    try {
      setLoadingSocial(true);
      
      const updateData = {
        [currentSocialPlatform]: socialUrl
      };
      
      await api.put('/social-links', updateData);
      await loadSocialLinks(); // Reload social links
      
      setShowSocialDialog(false);
      setSocialUrl('');
      setCurrentSocialPlatform(null);
      
      toast.success(`✅ ${currentSocialPlatform.charAt(0).toUpperCase() + currentSocialPlatform.slice(1)} link ${socialUrl ? 'updated' : 'removed'} successfully`);
    } catch (error: any) {
      console.error('Error saving social link:', error);
      toast.error(error.response?.data?.message || 'Failed to update social link');
    } finally {
      setLoadingSocial(false);
    }
  };

  const handleRemoveSocialLink = async (platform: 'twitter' | 'facebook' | 'instagram' | 'website') => {
    if (!window.confirm(`Are you sure you want to remove your ${platform} link?`)) {
      return;
    }

    try {
      await api.delete(`/social-links/${platform}`);
      await loadSocialLinks(); // Reload social links
      toast.success(`✅ ${platform.charAt(0).toUpperCase() + platform.slice(1)} link removed`);
    } catch (error: any) {
      console.error('Error removing social link:', error);
      toast.error(error.response?.data?.message || 'Failed to remove social link');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleKYCClick = () => {
    navigate('/kyc-verification');
  };

  const handle2FAToggle = async (enabled: boolean) => {
    if (enabled) {
      // Setup 2FA
      try {
        setLoading2FA(true);
        const response = await api.post('/2fa/setup');
        setTwoFAData({
          secret: response.data.secret,
          qrCodeUrl: response.data.qrCodeUrl,
          backupCodes: response.data.backupCodes
        });
        setShow2FASetup(true);
        toast.success('✅ Scan QR code with your authenticator app!');
      } catch (error: any) {
        console.error('Error setting up 2FA:', error);
        toast.error(error.response?.data?.message || 'Failed to setup 2FA');
      } finally {
        setLoading2FA(false);
      }
    } else {
      // Show disable confirmation (will be handled by handleDisable2FA)
      setShow2FASetup(false);
    }
  };

  const handleEnable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading2FA(true);
      await api.post('/2fa/enable', { token: verificationCode });
      
      // Update local state
      setVerifications(prev => ({
        ...prev,
        twoFactor: { ...prev.twoFactor, enabled: true }
      }));
      
      // Update auth store
      if (user) {
        setAuth({ ...user, twoFactorEnabled: true }, user.token || '');
      }
      
      setShow2FASetup(false);
      setVerificationCode('');
      setTwoFAData(null);
      toast.success('✅ 2FA enabled successfully!');
    } catch (error: any) {
      console.error('Error enabling 2FA:', error);
      toast.error(error.response?.data?.message || 'Invalid code');
    } finally {
      setLoading2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!disablePassword) {
      toast.error('Password is required');
      return;
    }

    try {
      setLoading2FA(true);
      await api.post('/2fa/disable', { password: disablePassword });
      
      // Update local state
      setVerifications(prev => ({
        ...prev,
        twoFactor: { ...prev.twoFactor, enabled: false }
      }));
      
      // Update auth store
      if (user) {
        setAuth({ ...user, twoFactorEnabled: false }, user.token || '');
      }
      
      setDisablePassword('');
      toast.success('✅ 2FA disabled successfully');
    } catch (error: any) {
      console.error('Error disabling 2FA:', error);
      toast.error(error.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setLoading2FA(false);
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    try {
      setLoadingPassword(true);
      await api.post('/password/change', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Reload password info
      await loadPasswordInfo();

      setShowPasswordChange(false);
      toast.success('✅ Password changed successfully!');
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoadingPassword(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`✅ ${label} copied to clipboard!`);
  };

  const getKYCStatusBadge = () => {
    switch (verifications.kyc.status) {
      case 'approved':
        return (
          <Badge variant="default" className="bg-emerald-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'under_review':
        return (
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Under Review
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

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
              <div className="text-xs text-muted-foreground">Verifications</div>
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Verifications</h1>
          <p className="text-muted-foreground">
            Manage your account security and verification settings
          </p>
        </div>

        {/* Main Verifications */}
        <div className="space-y-4 mb-8">
          {/* Profile Verification */}
          <Card 
            className="p-6 hover:shadow-lg transition-all cursor-pointer border-2"
            onClick={handleKYCClick}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Profile Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    {verifications.kyc.verified 
                      ? `Level ${verifications.kyc.level} - All requirements met`
                      : 'Complete identity verification to unlock all features'
                    }
                  </p>
                  {verifications.kyc.verified && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last verified: {verifications.kyc.lastUpdate}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getKYCStatusBadge()}
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your account security settings
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* 2FA Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-amber-500" />
                  <div>
                    <div className="font-semibold">Two-Factor Authentication (2FA)</div>
                    <div className="text-sm text-muted-foreground">
                      {verifications.twoFactor.enabled 
                        ? 'Extra security enabled' 
                        : 'Add an extra layer of security'
                      }
                    </div>
                  </div>
                </div>
                <Switch
                  checked={verifications.twoFactor.enabled}
                  onCheckedChange={handle2FAToggle}
                />
              </div>

              {/* Password */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-semibold">Password</div>
                    <div className="text-sm text-muted-foreground">
                      {passwordInfo 
                        ? `Last changed: ${passwordInfo.daysSinceChange} days ago`
                        : 'Loading...'
                      }
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPasswordChange(true)}
                >
                  Change
                </Button>
              </div>

              {/* Login Sessions */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-semibold">Login Sessions</div>
                    <div className="text-sm text-muted-foreground">
                      {sessionsCount > 0 ? `${sessionsCount} active device${sessionsCount > 1 ? 's' : ''}` : 'Loading...'}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowSessions(true);
                    loadSessions(); // Reload when opening
                  }}
                >
                  Manage
                </Button>
              </div>
            </div>
          </Card>

          {/* Contact Verification */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Contact Information</h3>
                <p className="text-sm text-muted-foreground">
                  Verify your email and phone number
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email Verification */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3 flex-1">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <div className="font-semibold">Email Address</div>
                    <div className="text-sm text-muted-foreground">
                      {verifications.email.email}
                    </div>
                  </div>
                </div>
                {verifications.email.verified ? (
                  <Badge variant="default" className="bg-emerald-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm">
                    Verify
                  </Button>
                )}
              </div>

              {/* Phone Verification */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3 flex-1">
                  <Phone className="h-5 w-5 text-emerald-500" />
                  <div className="flex-1">
                    <div className="font-semibold">Phone Number</div>
                    <div className="text-sm text-muted-foreground">
                      {verifications.phone.verified 
                        ? verifications.phone.number 
                        : 'Not added yet'
                      }
                    </div>
                  </div>
                </div>
                {verifications.phone.verified ? (
                  <Badge variant="default" className="bg-emerald-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm">
                    Add Phone
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Social Media Links */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Social Media</h3>
                <p className="text-sm text-muted-foreground">
                  Link your social media accounts
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Twitter */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3 flex-1">
                  <Twitter className="h-5 w-5 text-blue-400" />
                  <div className="flex-1">
                    <div className="font-semibold">Twitter</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {verifications.social.twitter.linked 
                        ? `@${verifications.social.twitter.username}` 
                        : 'Not linked'
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {verifications.social.twitter.linked ? (
                    <>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        Linked
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleLinkSocial('twitter')}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveSocialLink('twitter')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleLinkSocial('twitter')}
                    >
                      Link
                    </Button>
                  )}
                </div>
              </div>

              {/* Facebook */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3 flex-1">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-semibold">Facebook</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {verifications.social.facebook.linked 
                        ? verifications.social.facebook.username 
                        : 'Not linked'
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {verifications.social.facebook.linked ? (
                    <>
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        Linked
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleLinkSocial('facebook')}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveSocialLink('facebook')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleLinkSocial('facebook')}
                    >
                      Link
                    </Button>
                  )}
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3 flex-1">
                  <Instagram className="h-5 w-5 text-pink-500" />
                  <div className="flex-1">
                    <div className="font-semibold">Instagram</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {verifications.social.instagram.linked 
                        ? `@${verifications.social.instagram.username}` 
                        : 'Not linked'
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {verifications.social.instagram.linked ? (
                    <>
                      <Badge variant="outline" className="text-pink-500 border-pink-500">
                        Linked
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleLinkSocial('instagram')}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveSocialLink('instagram')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleLinkSocial('instagram')}
                    >
                      Link
                    </Button>
                  )}
                </div>
              </div>

              {/* Website */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3 flex-1">
                  <Globe className="h-5 w-5 text-emerald-500" />
                  <div className="flex-1">
                    <div className="font-semibold">Website</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {verifications.social.website.linked 
                        ? verifications.social.website.url 
                        : 'Not added'
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {verifications.social.website.linked ? (
                    <>
                      <Badge variant="outline" className="text-emerald-500 border-emerald-500">
                        Added
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleLinkSocial('website')}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveSocialLink('website')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleLinkSocial('website')}
                    >
                      Add
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Security Tips */}
        <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-bold mb-2">Security Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Complete all verification levels to unlock full features</li>
                <li>• Enable 2FA for enhanced account security</li>
                <li>• Use a strong, unique password</li>
                <li>• Verify your email and phone number</li>
                <li>• Regularly review your login sessions</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 2FA Setup Dialog */}
        {show2FASetup && twoFAData && (
          <Card className="p-6 border-2 border-amber-500/30 bg-card/95 backdrop-blur">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Setup Two-Factor Authentication</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShow2FASetup(false);
                    setVerificationCode('');
                  }}
                >
                  ✕
                </Button>
              </div>

              {/* Step 1: Scan QR Code */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600 font-semibold">
                  <QrCode className="h-5 w-5" />
                  <span>Step 1: Scan QR Code</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Open your authenticator app (Google Authenticator, Authy, etc.) and scan this QR code:
                </p>
                
                {/* QR Code Display (using otpauth URL) */}
                <div className="flex justify-center p-6 bg-white rounded-lg">
                  <div className="text-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(twoFAData.qrCodeUrl)}`}
                      alt="2FA QR Code"
                      className="mx-auto"
                    />
                    <p className="text-xs text-gray-600 mt-2">Scan with your authenticator app</p>
                  </div>
                </div>

                {/* Manual Entry Key */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Or enter this key manually:</p>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded border">
                    <code className="flex-1 text-sm font-mono break-all">{twoFAData.secret}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(twoFAData.secret, 'Secret key')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Step 2: Backup Codes */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <Key className="h-5 w-5" />
                  <span>Step 2: Save Backup Codes</span>
                </div>
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-sm font-semibold text-amber-600 mb-2">⚠️ Important: Save these backup codes!</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Use these codes to access your account if you lose your phone. Each code can only be used once.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {twoFAData.backupCodes.map((code, index) => (
                      <div key={index} className="p-2 bg-background rounded border font-mono text-sm">
                        {code}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => copyToClipboard(twoFAData.backupCodes.join('\n'), 'Backup codes')}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All Codes
                  </Button>
                </div>
              </div>

              {/* Step 3: Verify */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  <Smartphone className="h-5 w-5" />
                  <span>Step 3: Verify Code</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app:
                </p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="flex-1 text-center text-2xl font-mono tracking-widest"
                  />
                  <Button
                    onClick={handleEnable2FA}
                    disabled={loading2FA || verificationCode.length !== 6}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    {loading2FA ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Enable 2FA
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 2FA Disable Dialog */}
        {verifications.twoFactor.enabled && !show2FASetup && (
          <Card className="p-6 mt-4 border-2 border-red-500/30 bg-card/95">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <AlertCircle className="h-5 w-5" />
                <span>Disable Two-Factor Authentication</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter your password to disable 2FA:
              </p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Your password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="destructive"
                  onClick={handleDisable2FA}
                  disabled={loading2FA || !disablePassword}
                >
                  {loading2FA ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Disabling...
                    </>
                  ) : (
                    'Disable'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Password Change Dialog */}
        {showPasswordChange && (
          <Card className="p-6 mt-4 border-2 border-blue-500/30 bg-card/95 backdrop-blur">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Change Password</h3>
                    <p className="text-sm text-muted-foreground">
                      {passwordInfo && `Last changed ${passwordInfo.daysSinceChange} days ago`}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                {/* Current Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Current Password</label>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full"
                  />
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">New Password</label>
                  <Input
                    type="password"
                    placeholder="Enter new password (min. 6 characters)"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full"
                  />
                  {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                    <p className="text-xs text-amber-600">⚠️ Password must be at least 6 characters</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Confirm New Password</label>
                  <Input
                    type="password"
                    placeholder="Re-enter new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full"
                  />
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-xs text-red-600">❌ Passwords do not match</p>
                  )}
                </div>

                {/* Security Tips */}
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-xs font-semibold text-blue-600 mb-1">🔒 Password Security Tips:</p>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    <li>• Use at least 8 characters</li>
                    <li>• Mix uppercase & lowercase letters</li>
                    <li>• Include numbers and special characters</li>
                    <li>• Avoid common words or personal info</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    disabled={loadingPassword}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    onClick={handleChangePassword}
                    disabled={
                      loadingPassword ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword ||
                      passwordData.newPassword !== passwordData.confirmPassword ||
                      passwordData.newPassword.length < 6
                    }
                  >
                    {loadingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Login Sessions Dialog */}
        {showSessions && (
          <Card className="p-6 mt-4 border-2 border-purple-500/30 bg-card/95 backdrop-blur">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Login Sessions</h3>
                    <p className="text-sm text-muted-foreground">
                      {sessionsCount} active device{sessionsCount > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowSessions(false)}
                >
                  ✕
                </Button>
              </div>

              {/* Logout All Button */}
              {sessionsCount > 1 && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogoutAllSessions}
                  disabled={loadingSessions}
                >
                  {loadingSessions ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout from All Other Devices
                    </>
                  )}
                </Button>
              )}

              {/* Sessions List */}
              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Smartphone className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No active sessions</p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-4 rounded-lg border ${
                        session.isCurrent
                          ? 'border-emerald-500/50 bg-emerald-500/10'
                          : 'border-border bg-muted/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Device Icon */}
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            session.deviceType === 'mobile'
                              ? 'bg-blue-500/20'
                              : session.deviceType === 'tablet'
                              ? 'bg-purple-500/20'
                              : 'bg-gray-500/20'
                          }`}>
                            <Smartphone className={`h-5 w-5 ${
                              session.deviceType === 'mobile'
                                ? 'text-blue-500'
                                : session.deviceType === 'tablet'
                                ? 'text-purple-500'
                                : 'text-gray-500'
                            }`} />
                          </div>

                          {/* Device Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{session.deviceName}</span>
                              {session.isCurrent && (
                                <Badge variant="default" className="bg-emerald-600">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground space-y-0.5">
                              <div>📍 {session.location}</div>
                              <div>🌐 {session.ipAddress}</div>
                              <div>⏰ Last active: {new Date(session.lastActive).toLocaleString()}</div>
                            </div>
                          </div>
                        </div>

                        {/* Logout Button */}
                        {!session.isCurrent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLogoutSession(session.id)}
                            disabled={loadingSessions}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {loadingSessions ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <LogOut className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Security Tips */}
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="text-xs font-semibold text-purple-600 mb-1">🔒 Security Tips:</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  <li>• If you see an unfamiliar device, logout immediately</li>
                  <li>• Keep only trusted devices logged in</li>
                  <li>• Use "Logout All" if you suspect unauthorized access</li>
                  <li>• Enable 2FA for extra security</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Social Link Dialog */}
        {showSocialDialog && currentSocialPlatform && (
          <Card className="p-6 mt-4 border-2 border-purple-500/30 bg-card/95 backdrop-blur">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <LinkIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {currentSocialPlatform === 'twitter' ? '🐦 Twitter' :
                       currentSocialPlatform === 'facebook' ? '📘 Facebook' :
                       currentSocialPlatform === 'instagram' ? '📷 Instagram' :
                       '🌐 Website'} Link
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {socialLinks[currentSocialPlatform] ? 'Update your link' : 'Add your profile link'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowSocialDialog(false);
                    setSocialUrl('');
                    setCurrentSocialPlatform(null);
                  }}
                >
                  ✕
                </Button>
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  {currentSocialPlatform.charAt(0).toUpperCase() + currentSocialPlatform.slice(1)} URL
                </label>
                <Input
                  type="url"
                  placeholder={
                    currentSocialPlatform === 'twitter' ? 'https://twitter.com/yourhandle' :
                    currentSocialPlatform === 'facebook' ? 'https://facebook.com/yourpage' :
                    currentSocialPlatform === 'instagram' ? 'https://instagram.com/yourhandle' :
                    'https://yourwebsite.com'
                  }
                  value={socialUrl}
                  onChange={(e) => setSocialUrl(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the full URL (including https://)
                </p>
              </div>

              {/* Platform-specific tips */}
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-xs font-semibold text-blue-600 mb-1">💡 Tips:</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {currentSocialPlatform === 'twitter' && (
                    <>
                      <li>• Use twitter.com or x.com URLs</li>
                      <li>• Example: https://twitter.com/REGsGlobal</li>
                    </>
                  )}
                  {currentSocialPlatform === 'facebook' && (
                    <>
                      <li>• Use your Facebook page or profile URL</li>
                      <li>• Example: https://facebook.com/REGsGlobal</li>
                    </>
                  )}
                  {currentSocialPlatform === 'instagram' && (
                    <>
                      <li>• Use your Instagram profile URL</li>
                      <li>• Example: https://instagram.com/REGsGlobal</li>
                    </>
                  )}
                  {currentSocialPlatform === 'website' && (
                    <>
                      <li>• Use your personal or business website URL</li>
                      <li>• Example: https://regsglobal.com</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowSocialDialog(false);
                    setSocialUrl('');
                    setCurrentSocialPlatform(null);
                  }}
                  disabled={loadingSocial}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSaveSocialLink}
                  disabled={loadingSocial || !socialUrl}
                >
                  {loadingSocial ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

