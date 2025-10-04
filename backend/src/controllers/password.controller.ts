import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User.model';
import bcrypt from 'bcryptjs';

/**
 * Password Controller - Handles password management
 * 
 * Features:
 * - Change password (with old password verification)
 * - Get last password change date
 * - Password strength validation
 */

/**
 * @route   GET /api/password/info
 * @desc    Get password information (last changed date)
 * @access  Private
 */
export const getPasswordInfo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate days since password was last changed
    const passwordChangedAt = user.updatedAt || user.createdAt;
    const daysSinceChange = Math.floor(
      (Date.now() - new Date(passwordChangedAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    res.json({
      lastChanged: passwordChangedAt,
      daysSinceChange,
      message: `Last changed: ${daysSinceChange} days ago`,
    });
  } catch (error: any) {
    console.error('Error getting password info:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/password/change
 * @desc    Change password
 * @access  Private
 */
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        message: 'All fields are required (currentPassword, newPassword, confirmPassword)' 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        message: 'New password and confirm password do not match' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters long' 
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ 
        message: 'New password must be different from current password' 
      });
    }

    // Get user with password field
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({
      message: '✅ Password changed successfully!',
      lastChanged: user.updatedAt,
    });
  } catch (error: any) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/password/validate-strength
 * @desc    Validate password strength
 * @access  Public
 */
export const validatePasswordStrength = async (req: AuthRequest, res: Response) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Password strength criteria
    const strength = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(strength).filter(Boolean).length;
    let level: 'weak' | 'medium' | 'strong' = 'weak';
    let message = 'Weak password';

    if (score >= 4) {
      level = 'strong';
      message = 'Strong password';
    } else if (score >= 3) {
      level = 'medium';
      message = 'Medium password';
    }

    res.json({
      strength: level,
      score,
      maxScore: 5,
      message,
      criteria: strength,
      suggestions: [
        !strength.length && 'Use at least 8 characters',
        !strength.uppercase && 'Add uppercase letters (A-Z)',
        !strength.lowercase && 'Add lowercase letters (a-z)',
        !strength.number && 'Add numbers (0-9)',
        !strength.special && 'Add special characters (!@#$%...)',
      ].filter(Boolean),
    });
  } catch (error: any) {
    console.error('Error validating password:', error);
    res.status(500).json({ message: error.message });
  }
};

