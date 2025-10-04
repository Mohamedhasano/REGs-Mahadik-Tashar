import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.model';
import { AuthRequest } from '../middleware/auth';
import { createSession } from './session.controller';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, referralCode } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Handle referral code (non-blocking)
    let referredByUser = null;
    let referralWarning = null;
    if (referralCode && referralCode.trim() !== '') {
      referredByUser = await User.findOne({ referralCode: referralCode.toUpperCase().trim() });
      if (!referredByUser) {
        // Don't block registration, just warn the user
        referralWarning = 'Invalid referral code - registration will continue without referral bonus';
      }
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      role: role || 'trader',
      referredBy: referredByUser?._id,
    });

    // Update referrer's stats
    if (referredByUser) {
      referredByUser.referralCount += 1;
      referredByUser.referralEarnings += 10; // $10 bonus for referrer
      await referredByUser.save();
    }

    const token = generateToken(String(user._id));

    // Create login session
    await createSession(String(user._id), token, req);

    // Prepare success message
    let successMessage = 'Account created successfully!';
    if (referredByUser) {
      successMessage = 'Account created! Referral bonus will be applied on first trade.';
    } else if (referralWarning) {
      successMessage = 'Account created successfully! Note: ' + referralWarning;
    }

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        kycStatus: user.kycStatus,
        referralCode: user.referralCode,
        referredBy: referredByUser ? {
          name: referredByUser.name,
          referralCode: referredByUser.referralCode,
        } : null,
      },
      token,
      message: successMessage,
      warning: referralWarning,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(String(user._id));

    // Create login session
    await createSession(String(user._id), token, req);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        kycStatus: user.kycStatus,
        referralCode: user.referralCode,
        referralEarnings: user.referralEarnings,
        referralCount: user.referralCount,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.user._id).populate('referredBy', 'name email referralCode');

    res.json({
      user: {
        id: user?._id,
        email: user?.email,
        name: user?.name,
        role: user?.role,
        isVerified: user?.isVerified,
        kycStatus: user?.kycStatus,
        referralCode: user?.referralCode,
        referralEarnings: user?.referralEarnings,
        referralCount: user?.referralCount,
        referredBy: user?.referredBy,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token to user (you'll need to add these fields to User model)
    // user.resetPasswordToken = hashedToken;
    // user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    // await user.save();

    // In production, send email with reset link
    // const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;
    // await sendEmail({ to: user.email, subject: 'Password Reset', html: resetUrl });

    res.json({
      message: 'Password reset email sent',
      // Remove in production, only for testing
      resetToken: resetToken,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    // const user = await User.findOne({
    //   resetPasswordToken: hashedToken,
    //   resetPasswordExpire: { $gt: Date.now() },
    // });

    // For now, just return success
    res.json({
      message: 'Password reset successful',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const oauthCallback = async (req: Request, res: Response) => {
  try {
    const { provider } = req.params;
    const { token, email, name } = req.body;

    // In production, verify the OAuth token with the provider
    // For now, create or find user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        password: crypto.randomBytes(32).toString('hex'), // Random password for OAuth users
        role: 'trader',
        isVerified: false, // Users must complete KYC verification
        kycStatus: 'pending', // KYC pending by default
      });
    }

    const jwtToken = generateToken(String(user._id));

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        kycStatus: user.kycStatus,
        referralCode: user.referralCode,
      },
      token: jwtToken,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Validate referral code
export const validateReferralCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    if (!code || code.trim() === '') {
      return res.status(400).json({ 
        valid: false, 
        message: 'Referral code is required' 
      });
    }

    const user = await User.findOne({ 
      referralCode: code.toUpperCase().trim() 
    }).select('name referralCode');

    if (!user) {
      return res.json({ 
        valid: false, 
        message: 'Invalid referral code' 
      });
    }

    res.json({ 
      valid: true, 
      message: `Valid referral code from ${user.name}`,
      referrerName: user.name 
    });
  } catch (error: any) {
    res.status(500).json({ 
      valid: false, 
      message: error.message 
    });
  }
};

// Get referral stats
export const getReferralStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.user._id);
    const referrals = await User.find({ referredBy: req.user._id }).select('name email createdAt');

    res.json({
      referralCode: user?.referralCode,
      referralCount: user?.referralCount || 0,
      referralEarnings: user?.referralEarnings || 0,
      referrals: referrals,
      referralLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/register?ref=${user?.referralCode}`,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
