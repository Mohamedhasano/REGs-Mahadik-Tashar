import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User, { VIPLevel } from '../models/User.model';

// VIP Level Requirements (USD trading volume in 30 days)
const VIP_REQUIREMENTS = {
  Regular: 0,
  VIP1: 1000,
  VIP2: 10000,
  VIP3: 50000,
  VIP4: 250000,
  VIP5: 1000000,
};

// VIP Benefits per level
const VIP_BENEFITS_CONFIG = {
  Regular: {
    tradingFeeDiscount: 0,
    withdrawalFeeDiscount: 0,
    dailyWithdrawalLimit: 2000,
    prioritySupport: false,
    exclusiveEvents: false,
    advancedAnalytics: false,
    customAPI: false,
    dedicatedManager: false,
  },
  VIP1: {
    tradingFeeDiscount: 5,
    withdrawalFeeDiscount: 10,
    dailyWithdrawalLimit: 10000,
    prioritySupport: true,
    exclusiveEvents: false,
    advancedAnalytics: false,
    customAPI: false,
    dedicatedManager: false,
  },
  VIP2: {
    tradingFeeDiscount: 10,
    withdrawalFeeDiscount: 20,
    dailyWithdrawalLimit: 50000,
    prioritySupport: true,
    exclusiveEvents: true,
    advancedAnalytics: true,
    customAPI: false,
    dedicatedManager: false,
  },
  VIP3: {
    tradingFeeDiscount: 15,
    withdrawalFeeDiscount: 30,
    dailyWithdrawalLimit: 100000,
    prioritySupport: true,
    exclusiveEvents: true,
    advancedAnalytics: true,
    customAPI: true,
    dedicatedManager: false,
  },
  VIP4: {
    tradingFeeDiscount: 20,
    withdrawalFeeDiscount: 40,
    dailyWithdrawalLimit: 500000,
    prioritySupport: true,
    exclusiveEvents: true,
    advancedAnalytics: true,
    customAPI: true,
    dedicatedManager: false,
  },
  VIP5: {
    tradingFeeDiscount: 25,
    withdrawalFeeDiscount: 50,
    dailyWithdrawalLimit: 1000000,
    prioritySupport: true,
    exclusiveEvents: true,
    advancedAnalytics: true,
    customAPI: true,
    dedicatedManager: true,
  },
};

// Calculate VIP level based on trading volume
function calculateVIPLevel(tradingVolume: number): VIPLevel {
  if (tradingVolume >= VIP_REQUIREMENTS.VIP5) return 'VIP5';
  if (tradingVolume >= VIP_REQUIREMENTS.VIP4) return 'VIP4';
  if (tradingVolume >= VIP_REQUIREMENTS.VIP3) return 'VIP3';
  if (tradingVolume >= VIP_REQUIREMENTS.VIP2) return 'VIP2';
  if (tradingVolume >= VIP_REQUIREMENTS.VIP1) return 'VIP1';
  return 'Regular';
}

// Get next level requirement
function getNextLevelRequirement(currentLevel: VIPLevel): number {
  const levels: VIPLevel[] = ['Regular', 'VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5'];
  const currentIndex = levels.indexOf(currentLevel);
  const nextLevel = levels[currentIndex + 1];
  return nextLevel ? VIP_REQUIREMENTS[nextLevel] : VIP_REQUIREMENTS.VIP5;
}

// Get benefits unlocked
function getBenefitsUnlocked(level: VIPLevel): string[] {
  const benefits = VIP_BENEFITS_CONFIG[level];
  const unlocked: string[] = [];
  
  if (benefits.tradingFeeDiscount > 0) {
    unlocked.push(`${benefits.tradingFeeDiscount}% Trading Fee Discount`);
  }
  if (benefits.withdrawalFeeDiscount > 0) {
    unlocked.push(`${benefits.withdrawalFeeDiscount}% Withdrawal Fee Discount`);
  }
  unlocked.push(`$${benefits.dailyWithdrawalLimit.toLocaleString()} Daily Limit`);
  if (benefits.prioritySupport) unlocked.push('Priority Support');
  if (benefits.exclusiveEvents) unlocked.push('Exclusive Events');
  if (benefits.advancedAnalytics) unlocked.push('Advanced Analytics');
  if (benefits.customAPI) unlocked.push('Custom API Access');
  if (benefits.dedicatedManager) unlocked.push('Dedicated Account Manager');
  
  return unlocked;
}

// Get user's VIP status
export const getVIPStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select(
      'vipLevel vipTradingVolume30Days vipTotalTradingVolume vipLevelUpgradeDate vipBenefits vipProgress'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate current VIP level
    const calculatedLevel = calculateVIPLevel(user.vipTradingVolume30Days);
    const nextLevelRequirement = getNextLevelRequirement(calculatedLevel);
    const progressPercentage = (user.vipTradingVolume30Days / nextLevelRequirement) * 100;
    const benefitsUnlocked = getBenefitsUnlocked(calculatedLevel);

    // Update user's VIP data
    user.vipLevel = calculatedLevel;
    user.vipBenefits = VIP_BENEFITS_CONFIG[calculatedLevel];
    user.vipProgress = {
      currentLevel: calculatedLevel,
      tradingVolume30Days: user.vipTradingVolume30Days,
      nextLevelRequirement,
      progressPercentage: Math.min(progressPercentage, 100),
      benefitsUnlocked,
    };

    await user.save();

    res.json({
      vipLevel: user.vipLevel,
      vipTradingVolume30Days: user.vipTradingVolume30Days,
      vipTotalTradingVolume: user.vipTotalTradingVolume,
      vipLevelUpgradeDate: user.vipLevelUpgradeDate,
      vipBenefits: user.vipBenefits,
      vipProgress: user.vipProgress,
    });
  } catch (error: any) {
    console.error('Error getting VIP status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add trading volume (محفوظ للأبد!)
export const addTradingVolume = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { amount } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add trading volume (محفوظ للأبد - ممنوع الحذف!)
    const oldLevel = user.vipLevel;
    user.vipTradingVolume30Days += amount;
    user.vipTotalTradingVolume += amount;

    // Calculate new VIP level
    const newLevel = calculateVIPLevel(user.vipTradingVolume30Days);
    const levelChanged = oldLevel !== newLevel;

    if (levelChanged) {
      user.vipLevel = newLevel;
      user.vipLevelUpgradeDate = new Date();
      user.vipBenefits = VIP_BENEFITS_CONFIG[newLevel];
    }

    // Update progress
    const nextLevelRequirement = getNextLevelRequirement(newLevel);
    const progressPercentage = (user.vipTradingVolume30Days / nextLevelRequirement) * 100;
    const benefitsUnlocked = getBenefitsUnlocked(newLevel);

    user.vipProgress = {
      currentLevel: newLevel,
      tradingVolume30Days: user.vipTradingVolume30Days,
      nextLevelRequirement,
      progressPercentage: Math.min(progressPercentage, 100),
      benefitsUnlocked,
    };

    await user.save();

    res.json({
      message: levelChanged 
        ? `Congratulations! You've been upgraded to ${newLevel}!` 
        : 'Trading volume updated successfully',
      levelChanged,
      oldLevel,
      newLevel: user.vipLevel,
      vipTradingVolume30Days: user.vipTradingVolume30Days,
      vipTotalTradingVolume: user.vipTotalTradingVolume,
      vipBenefits: user.vipBenefits,
      vipProgress: user.vipProgress,
    });
  } catch (error: any) {
    console.error('Error adding trading volume:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get VIP benefits details for all levels
export const getAllVIPBenefits = async (req: AuthRequest, res: Response) => {
  try {
    const levels: VIPLevel[] = ['Regular', 'VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5'];
    
    const benefitsInfo = levels.map(level => ({
      level,
      requirement: VIP_REQUIREMENTS[level],
      benefits: VIP_BENEFITS_CONFIG[level],
      benefitsUnlocked: getBenefitsUnlocked(level),
    }));

    res.json({
      levels: benefitsInfo,
    });
  } catch (error: any) {
    console.error('Error getting VIP benefits:', error);
    res.status(500).json({ message: error.message });
  }
};

// Admin: Set user VIP level manually
export const setUserVIPLevel = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { vipLevel } = req.body;
    
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can set VIP levels' });
    }

    const validLevels: VIPLevel[] = ['Regular', 'VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5'];
    if (!validLevels.includes(vipLevel)) {
      return res.status(400).json({ message: 'Invalid VIP level' });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.vipLevel = vipLevel;
    user.vipLevelUpgradeDate = new Date();
    user.vipBenefits = VIP_BENEFITS_CONFIG[vipLevel];
    
    // Update progress
    const nextLevelRequirement = getNextLevelRequirement(vipLevel);
    const progressPercentage = (user.vipTradingVolume30Days / nextLevelRequirement) * 100;
    const benefitsUnlocked = getBenefitsUnlocked(vipLevel);

    user.vipProgress = {
      currentLevel: vipLevel,
      tradingVolume30Days: user.vipTradingVolume30Days,
      nextLevelRequirement,
      progressPercentage: Math.min(progressPercentage, 100),
      benefitsUnlocked,
    };

    await user.save();

    res.json({
      message: `User VIP level set to ${vipLevel} successfully`,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        vipLevel: user.vipLevel,
        vipBenefits: user.vipBenefits,
      },
    });
  } catch (error: any) {
    console.error('Error setting VIP level:', error);
    res.status(500).json({ message: error.message });
  }
};

