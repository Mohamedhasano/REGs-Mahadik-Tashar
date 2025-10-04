import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'trader' | 'admin' | 'shariah_board' | 'support' | 'project';
export type KYCStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

// KYC Level 1 Data
export interface IKYCLevel1 {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  citizenshipCountry: string;
  residenceCountry: string;
  completedAt?: Date;
}

// KYC Level 2 Data
export interface IKYCLevel2 {
  idCard?: {
    fileName: string;
    fileUrl: string;
    uploadedAt: Date;
  };
  passport?: {
    fileName: string;
    fileUrl: string;
    uploadedAt: Date;
  };
  driverLicense?: {
    fileName: string;
    fileUrl: string;
    uploadedAt: Date;
  };
  completedAt?: Date;
}

// KYC Level 3 Data
export interface IKYCLevel3 {
  videoVerified: boolean;
  aiConfidenceScore?: number;
  livenessCheckPassed: boolean;
  verifiedAt?: Date;
  completedAt?: Date;
}

// VIP System
export type VIPLevel = 'Regular' | 'VIP1' | 'VIP2' | 'VIP3' | 'VIP4' | 'VIP5';

export interface IVIPBenefits {
  tradingFeeDiscount: number; // Percentage discount (0-100)
  withdrawalFeeDiscount: number;
  dailyWithdrawalLimit: number; // USD
  prioritySupport: boolean;
  exclusiveEvents: boolean;
  advancedAnalytics: boolean;
  customAPI: boolean;
  dedicatedManager: boolean;
}

export interface IVIPProgress {
  currentLevel: VIPLevel;
  tradingVolume30Days: number; // USD
  nextLevelRequirement: number; // USD
  progressPercentage: number; // 0-100
  benefitsUnlocked: string[];
  levelUpgradeDate?: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  kycStatus?: KYCStatus;
  kycLevel: number; // 0, 1, 2, or 3
  kycLevel1?: IKYCLevel1;
  kycLevel2?: IKYCLevel2;
  kycLevel3?: IKYCLevel3;
  kycSubmittedAt?: Date;
  kycApprovedAt?: Date;
  kycRejectedAt?: Date;
  kycRejectionReason?: string;
  kycDocuments?: string[];
  phone?: string;
  country?: string;
  avatar?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string; // Secret key for TOTP
  twoFactorBackupCodes?: string[]; // Backup codes (hashed)
  twoFactorEnabledAt?: Date; // When 2FA was enabled
  referralCode: string;
  referredBy?: mongoose.Types.ObjectId;
  referralEarnings: number;
  referralCount: number;
  
  // VIP System (محفوظ للأبد - ممنوع الحذف!)
  vipLevel: VIPLevel;
  vipTradingVolume30Days: number;
  vipTotalTradingVolume: number;
  vipLevelUpgradeDate?: Date;
  vipBenefits: IVIPBenefits;
  vipProgress: IVIPProgress;
  
  // Social Media Links
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['trader', 'admin', 'shariah_board', 'support', 'project'],
      default: 'trader',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'under_review'],
      default: 'pending',
    },
    kycLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 3,
    },
    kycLevel1: {
      firstName: String,
      lastName: String,
      dateOfBirth: String,
      citizenshipCountry: String,
      residenceCountry: String,
      completedAt: Date,
    },
    kycLevel2: {
      idCard: {
        fileName: String,
        fileUrl: String,
        uploadedAt: Date,
      },
      passport: {
        fileName: String,
        fileUrl: String,
        uploadedAt: Date,
      },
      driverLicense: {
        fileName: String,
        fileUrl: String,
        uploadedAt: Date,
      },
      completedAt: Date,
    },
    kycLevel3: {
      videoVerified: { type: Boolean, default: false },
      aiConfidenceScore: Number,
      livenessCheckPassed: { type: Boolean, default: false },
      verifiedAt: Date,
      completedAt: Date,
    },
    kycSubmittedAt: Date,
    kycApprovedAt: Date,
    kycRejectedAt: Date,
    kycRejectionReason: String,
    kycDocuments: [String],
    phone: String,
    country: String,
    avatar: String,
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false, // Don't return in queries by default (security)
    },
    twoFactorBackupCodes: {
      type: [String],
      select: false, // Don't return in queries by default (security)
    },
    twoFactorEnabledAt: {
      type: Date,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true, // Allow null temporarily during creation
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    referralEarnings: {
      type: Number,
      default: 0,
    },
    referralCount: {
      type: Number,
      default: 0,
    },
    
    // VIP System (محفوظ للأبد - ممنوع الحذف!)
    vipLevel: {
      type: String,
      enum: ['Regular', 'VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5'],
      default: 'Regular',
    },
    vipTradingVolume30Days: {
      type: Number,
      default: 0,
    },
    vipTotalTradingVolume: {
      type: Number,
      default: 0,
    },
    vipLevelUpgradeDate: Date,
    vipBenefits: {
      tradingFeeDiscount: { type: Number, default: 0 },
      withdrawalFeeDiscount: { type: Number, default: 0 },
      dailyWithdrawalLimit: { type: Number, default: 2000 },
      prioritySupport: { type: Boolean, default: false },
      exclusiveEvents: { type: Boolean, default: false },
      advancedAnalytics: { type: Boolean, default: false },
      customAPI: { type: Boolean, default: false },
      dedicatedManager: { type: Boolean, default: false },
    },
    vipProgress: {
      currentLevel: { type: String, default: 'Regular' },
      tradingVolume30Days: { type: Number, default: 0 },
      nextLevelRequirement: { type: Number, default: 1000 },
      progressPercentage: { type: Number, default: 0 },
      benefitsUnlocked: [String],
      levelUpgradeDate: Date,
    },
    
    // Social Media Links
    socialLinks: {
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      website: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique referral code before validation
UserSchema.pre('validate', async function (next) {
  // Generate referral code if not exists (before validation)
  if (!this.referralCode) {
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (!isUnique && attempts < maxAttempts) {
      const code = generateReferralCode();
      const existing = await mongoose.model('User').findOne({ referralCode: code });
      
      if (!existing) {
        this.referralCode = code;
        isUnique = true;
      }
      attempts++;
    }
    
    if (!isUnique) {
      return next(new Error('Failed to generate unique referral code'));
    }
  }
  
  next();
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // Hash password if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Helper function to generate referral code
function generateReferralCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

export default mongoose.model<IUser>('User', UserSchema);
