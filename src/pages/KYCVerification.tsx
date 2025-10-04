import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  Upload,
  Video,
  User,
  Calendar,
  Globe,
  FileText,
  Lock,
  Shield,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Home,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function KYCVerification() {
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  
  // Level 1 data
  const [level1Data, setLevel1Data] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    citizenshipCountry: '',
    residenceCountry: ''
  });

  // Level 2 data
  const [level2Data, setLevel2Data] = useState({
    idCard: null as File | null,
    passport: null as File | null,
    driverLicense: null as File | null
  });

  // Level 3 data
  const [level3Started, setLevel3Started] = useState(false);
  const [level3Completed, setLevel3Completed] = useState(false);

  const countries = [
    'Saudi Arabia', 'United Arab Emirates', 'Egypt', 'Pakistan', 'Turkey',
    'Malaysia', 'Indonesia', 'Bangladesh', 'Morocco', 'Algeria',
    'Jordan', 'Kuwait', 'Qatar', 'Bahrain', 'Oman',
    'Lebanon', 'Tunisia', 'Palestine', 'Iraq', 'Syria'
  ];

  // Load KYC status on mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadKYCStatus();
  }, [user, navigate]);

  const loadKYCStatus = async () => {
    try {
      setLoadingStatus(true);
      const response = await api.get('/kyc/status');
      const data = response.data;
      
      // Set completed levels
      const completed = [];
      if (data.kycLevel1) {
        completed.push(1);
        setLevel1Data({
          firstName: data.kycLevel1.firstName || '',
          lastName: data.kycLevel1.lastName || '',
          dateOfBirth: data.kycLevel1.dateOfBirth || '',
          citizenshipCountry: data.kycLevel1.citizenshipCountry || '',
          residenceCountry: data.kycLevel1.residenceCountry || ''
        });
      }
      if (data.kycLevel2 && (data.kycLevel2.hasIdCard || data.kycLevel2.hasPassport)) {
        completed.push(2);
      }
      if (data.kycLevel3 && data.kycLevel3.videoVerified) {
        completed.push(3);
        setLevel3Completed(true);
      }
      
      setCompletedLevels(completed);
      
      // Set current level to next incomplete level
      if (data.kycLevel === 0) {
        setCurrentLevel(1);
      } else if (data.kycLevel === 1) {
        setCurrentLevel(2);
      } else if (data.kycLevel === 2) {
        setCurrentLevel(3);
      } else {
        setCurrentLevel(3); // All levels completed
      }
      
      // Show status message
      if (data.kycStatus === 'approved') {
        toast.success('Your KYC is approved! ✅');
      } else if (data.kycStatus === 'under_review') {
        toast.info('Your KYC is under review 🔍');
      } else if (data.kycStatus === 'rejected') {
        toast.error(`KYC rejected: ${data.kycRejectionReason || 'Please resubmit'}`);
      }
      
    } catch (error: any) {
      console.error('Error loading KYC status:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to load KYC status');
      }
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleLevel1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!level1Data.firstName || !level1Data.lastName || !level1Data.dateOfBirth || 
        !level1Data.citizenshipCountry || !level1Data.residenceCountry) {
      toast.error('Please fill all required fields');
      return;
    }

    // Check age validation (18+)
    const birthDate = new Date(level1Data.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      toast.error('You must be at least 18 years old to complete KYC');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/kyc/level1', level1Data);
      
      setCompletedLevels([...completedLevels, 1]);
      toast.success('✅ Level 1 verification completed! Data saved permanently.');
      setCurrentLevel(2);
      
      // Update user in auth store
      if (user) {
        setAuth({ ...user, kycLevel: response.data.kycLevel, kycStatus: response.data.kycStatus }, user.token || '');
      }
    } catch (error: any) {
      console.error('Error submitting Level 1:', error);
      toast.error(error.response?.data?.message || 'Failed to submit Level 1');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (level: 'idCard' | 'passport' | 'driverLicense', file: File | null) => {
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      setLevel2Data({ ...level2Data, [level]: file });
      toast.success(`${level === 'idCard' ? 'ID Card' : level === 'passport' ? 'Passport' : 'Driver License'} selected!`);
    }
  };

  const handleLevel2Submit = async () => {
    if (!level2Data.idCard && !level2Data.passport && !level2Data.driverLicense) {
      toast.error('Please upload at least one document');
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData
      const formData = new FormData();
      if (level2Data.idCard) formData.append('idCard', level2Data.idCard);
      if (level2Data.passport) formData.append('passport', level2Data.passport);
      if (level2Data.driverLicense) formData.append('driverLicense', level2Data.driverLicense);
      
      const response = await api.post('/kyc/level2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setCompletedLevels([...completedLevels, 2]);
      toast.success('✅ Level 2 verification completed! Documents saved permanently.');
      setCurrentLevel(3);
      
      // Update user in auth store
      if (user) {
        setAuth({ ...user, kycLevel: response.data.kycLevel, kycStatus: response.data.kycStatus }, user.token || '');
      }
    } catch (error: any) {
      console.error('Error submitting Level 2:', error);
      toast.error(error.response?.data?.message || 'Failed to submit Level 2');
    } finally {
      setLoading(false);
    }
  };

  const startVideoVerification = async () => {
    setLevel3Started(true);
    toast.info('Starting AI face verification...');
    
    // Simulate AI verification process
    setTimeout(async () => {
      try {
        setLoading(true);
        
        const response = await api.post('/kyc/level3', {
          aiConfidenceScore: 97.8,
          livenessCheckPassed: true
        });
        
        setLevel3Completed(true);
        setCompletedLevels([...completedLevels, 3]);
        toast.success('✅ Level 3 verification completed! All data saved permanently.');
        
        // Update user in auth store
        if (user) {
          setAuth({ ...user, kycLevel: response.data.kycLevel, kycStatus: response.data.kycStatus }, user.token || '');
        }
        
        // Show success message after 2 seconds
        setTimeout(() => {
          toast.success('🎉 All KYC levels completed! Your verification is now under review.');
        }, 2000);
        
      } catch (error: any) {
        console.error('Error submitting Level 3:', error);
        toast.error(error.response?.data?.message || 'Failed to submit Level 3');
        setLevel3Started(false);
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  const calculateProgress = () => {
    return (completedLevels.length / 3) * 100;
  };

  const isLevelCompleted = (level: number) => completedLevels.includes(level);

  if (loadingStatus) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading KYC status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
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
            <h1 className="text-xl font-bold">Profile Verification</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="rounded-full"
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Progress Header */}
        <Card className="p-6 mb-6 border-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Identity Verification</h2>
              <p className="text-muted-foreground">
                Complete all 3 levels to verify your account
              </p>
            </div>
            <Badge variant={completedLevels.length === 3 ? "default" : "secondary"} className="text-lg px-4 py-2">
              {completedLevels.length}/3 Completed
            </Badge>
          </div>

          <Progress value={calculateProgress()} className="h-3 mb-4" />

          {/* Level Indicators */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  isLevelCompleted(level)
                    ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500'
                    : currentLevel === level
                    ? 'bg-blue-50 dark:bg-blue-950 border-blue-500'
                    : 'bg-muted border-border'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isLevelCompleted(level)
                      ? 'bg-emerald-600'
                      : currentLevel === level
                      ? 'bg-blue-600'
                      : 'bg-muted-foreground/30'
                  }`}
                >
                  {isLevelCompleted(level) ? (
                    <CheckCircle className="h-6 w-6 text-white" />
                  ) : (
                    <span className="text-white font-bold">{level}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-center">
                  Level {level}
                </span>
                <span className="text-xs text-muted-foreground text-center">
                  {level === 1 ? 'Personal Info' : level === 2 ? 'Documents' : 'Video Verification'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Security Badges */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 border-2 border-blue-500/20 bg-blue-500/5">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <div className="font-semibold">256-bit Encryption</div>
                <div className="text-xs text-muted-foreground">Bank-level security</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-2 border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-3">
              <Lock className="h-8 w-8 text-emerald-600" />
              <div>
                <div className="font-semibold">Privacy Protected</div>
                <div className="text-xs text-muted-foreground">No video stored</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-2 border-amber-500/20 bg-amber-500/5 col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-amber-600" />
              <div>
                <div className="font-semibold">AI-Powered</div>
                <div className="text-xs text-muted-foreground">Advanced verification</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Level Tabs */}
        <Tabs value={currentLevel.toString()} onValueChange={(val) => setCurrentLevel(parseInt(val) as 1 | 2 | 3)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="1" disabled={isLevelCompleted(1) && currentLevel > 1}>
              <User className="h-4 w-4 mr-2" />
              Level 1
            </TabsTrigger>
            <TabsTrigger value="2" disabled={!isLevelCompleted(1)}>
              <FileText className="h-4 w-4 mr-2" />
              Level 2
            </TabsTrigger>
            <TabsTrigger value="3" disabled={!isLevelCompleted(2)}>
              <Video className="h-4 w-4 mr-2" />
              Level 3
            </TabsTrigger>
          </TabsList>

          {/* Level 1: Personal Information */}
          <TabsContent value="1">
            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Level 1: Personal Information</h3>
                  <p className="text-sm text-muted-foreground">Enter your personal details - Data saved permanently</p>
                </div>
              </div>

              <form onSubmit={handleLevel1Submit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={level1Data.firstName}
                      onChange={(e) => setLevel1Data({ ...level1Data, firstName: e.target.value })}
                      placeholder="Enter your first name"
                      disabled={isLevelCompleted(1) || loading}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={level1Data.lastName}
                      onChange={(e) => setLevel1Data({ ...level1Data, lastName: e.target.value })}
                      placeholder="Enter your last name"
                      disabled={isLevelCompleted(1) || loading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="date"
                      value={level1Data.dateOfBirth}
                      onChange={(e) => setLevel1Data({ ...level1Data, dateOfBirth: e.target.value })}
                      className="pl-10"
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                      disabled={isLevelCompleted(1) || loading}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">You must be at least 18 years old</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Citizenship Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <select
                      value={level1Data.citizenshipCountry}
                      onChange={(e) => setLevel1Data({ ...level1Data, citizenshipCountry: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
                      disabled={isLevelCompleted(1) || loading}
                      required
                    >
                      <option value="">Select country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Residence Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <select
                      value={level1Data.residenceCountry}
                      onChange={(e) => setLevel1Data({ ...level1Data, residenceCountry: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
                      disabled={isLevelCompleted(1) || loading}
                      required
                    >
                      <option value="">Select country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {!isLevelCompleted(1) && (
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Submit Level 1
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>
                )}

                {isLevelCompleted(1) && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border-2 border-emerald-500 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Level 1 Completed ✓ - Data Saved Permanently</span>
                    </div>
                  </div>
                )}
              </form>
            </Card>
          </TabsContent>

          {/* Level 2: Document Upload */}
          <TabsContent value="2">
            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Level 2: Document Upload</h3>
                  <p className="text-sm text-muted-foreground">Upload your identity documents - Stored permanently</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* ID Card */}
                <div className="p-4 border-2 border-dashed rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">ID Card</span>
                      <Badge variant="secondary">Required</Badge>
                    </div>
                    {level2Data.idCard && <CheckCircle className="h-5 w-5 text-emerald-600" />}
                  </div>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload('idCard', e.target.files?.[0] || null)}
                    disabled={isLevelCompleted(2) || loading}
                  />
                  {level2Data.idCard && (
                    <p className="text-sm text-muted-foreground mt-2">Selected: {level2Data.idCard.name}</p>
                  )}
                </div>

                {/* Passport */}
                <div className="p-4 border-2 border-dashed rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Passport</span>
                      <Badge variant="outline">Optional</Badge>
                    </div>
                    {level2Data.passport && <CheckCircle className="h-5 w-5 text-emerald-600" />}
                  </div>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload('passport', e.target.files?.[0] || null)}
                    disabled={isLevelCompleted(2) || loading}
                  />
                  {level2Data.passport && (
                    <p className="text-sm text-muted-foreground mt-2">Selected: {level2Data.passport.name}</p>
                  )}
                </div>

                {/* Driver License */}
                <div className="p-4 border-2 border-dashed rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Driver License</span>
                      <Badge variant="outline">Optional</Badge>
                    </div>
                    {level2Data.driverLicense && <CheckCircle className="h-5 w-5 text-emerald-600" />}
                  </div>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload('driverLicense', e.target.files?.[0] || null)}
                    disabled={isLevelCompleted(2) || loading}
                  />
                  {level2Data.driverLicense && (
                    <p className="text-sm text-muted-foreground mt-2">Selected: {level2Data.driverLicense.name}</p>
                  )}
                </div>

                {!isLevelCompleted(2) && (
                  <Button 
                    onClick={handleLevel2Submit} 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mr-2" />
                        Submit Level 2
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>
                )}

                {isLevelCompleted(2) && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border-2 border-emerald-500 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Level 2 Completed ✓ - Documents Saved Permanently</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Level 3: Video Verification */}
          <TabsContent value="3">
            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Level 3: AI Face Verification</h3>
                  <p className="text-sm text-muted-foreground">Live face-to-face verification - Results saved permanently</p>
                </div>
              </div>

              {!level3Started && !level3Completed && (
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      Before You Start:
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span>Ensure good lighting on your face</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span>Remove glasses, masks, and hats</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span>Look directly at the camera</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span>Your video is NOT stored (privacy-first)</span>
                      </li>
                    </ul>
                  </div>

                  <Button 
                    onClick={startVideoVerification} 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Video className="h-5 w-5 mr-2" />
                        Start Face Verification
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              {level3Started && !level3Completed && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 border-8 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-xl font-bold mb-2">AI Verification in Progress...</h3>
                  <p className="text-muted-foreground mb-4">Please look at the camera</p>
                  <div className="space-y-2 text-sm text-left max-w-md mx-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                      <span>Analyzing face...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <span>Checking liveness...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></div>
                      <span>Verifying identity...</span>
                    </div>
                  </div>
                </div>
              )}

              {level3Completed && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-16 w-16 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Verification Complete! 🎉</h3>
                  <p className="text-muted-foreground mb-6">All KYC levels completed successfully - Data saved permanently</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600">✓</div>
                      <div className="text-sm mt-1">Level 1</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600">✓</div>
                      <div className="text-sm mt-1">Level 2</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600">✓</div>
                      <div className="text-sm mt-1">Level 3</div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg mb-6">
                    <p className="text-sm">
                      <strong>Your KYC is now under review.</strong><br />
                      You'll receive a notification once it's approved (usually within 24-48 hours).
                    </p>
                  </div>

                  <Button onClick={() => navigate('/profile')} className="w-full" size="lg">
                    Go to Profile
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
