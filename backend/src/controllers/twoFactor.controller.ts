import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User.model';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * 2FA Controller - Handles Two-Factor Authentication
 * 
 * Features:
 * - Generate 2FA secret and QR code
 * - Enable/Disable 2FA
 * - Verify 2FA tokens
 * - Generate backup codes
 * - Get 2FA status
 */

// Simple TOTP implementation (time-based OTP)
const generateTOTP = (secret: string, window = 0): string => {
  const epoch = Math.floor(Date.now() / 1000 / 30) + window;
  const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base64'));
  hmac.update(Buffer.from([0, 0, 0, 0, 0, 0, 0, 0].map((v, i) => i < 4 ? v : (epoch >> ((7 - i) * 8)) & 0xff)));
  const hash = hmac.digest();
  const offset = hash[hash.length - 1] & 0xf;
  const code = ((hash[offset] & 0x7f) << 24 | (hash[offset + 1] & 0xff) << 16 | (hash[offset + 2] & 0xff) << 8 | (hash[offset + 3] & 0xff)) % 1000000;
  return code.toString().padStart(6, '0');
};

const verifyTOTP = (token: string, secret: string): boolean => {
  // Check current window and ±1 window (90 seconds total)
  for (let i = -1; i <= 1; i++) {
    if (generateTOTP(secret, i) === token) {
      return true;
    }
  }
  return false;
};

// Generate random backup codes
const generateBackupCodes = (): string[] => {
  const codes: string[] = [];
  for (let i = 0; i < 8; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  return codes;
};

/**
 * @route   GET /api/2fa/status
 * @desc    Get 2FA status for current user
 * @access  Private
 */
export const get2FAStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('+twoFactorSecret +twoFactorBackupCodes');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      enabled: user.twoFactorEnabled,
      enabledAt: user.twoFactorEnabledAt,
      hasBackupCodes: user.twoFactorBackupCodes && user.twoFactorBackupCodes.length > 0,
      backupCodesCount: user.twoFactorBackupCodes?.length || 0,
    });
  } catch (error: any) {
    console.error('Error getting 2FA status:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/2fa/setup
 * @desc    Generate 2FA secret and QR code
 * @access  Private
 */
export const setup2FA = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is already enabled' });
    }

    // Generate a random secret (base32)
    const secret = crypto.randomBytes(20).toString('base64');

    // Generate backup codes
    const backupCodes = generateBackupCodes();
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => bcrypt.hash(code, 10))
    );

    // Save secret temporarily (not enabled yet)
    user.twoFactorSecret = secret;
    user.twoFactorBackupCodes = hashedBackupCodes;
    await user.save();

    // Generate manual entry key (for authenticator apps)
    const manualEntryKey = secret.replace(/=/g, '');

    // Generate QR code URL
    const otpauthUrl = `otpauth://totp/REGs Global (${user.email})?secret=${manualEntryKey}&issuer=REGs Global`;

    res.json({
      message: 'Scan this QR code with your authenticator app',
      secret: manualEntryKey,
      qrCodeUrl: otpauthUrl,
      backupCodes: backupCodes, // Show once, user must save these
    });
  } catch (error: any) {
    console.error('Error setting up 2FA:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/2fa/enable
 * @desc    Enable 2FA after verifying token
 * @access  Private
 */
export const enable2FA = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { token } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!token || token.length !== 6) {
      return res.status(400).json({ message: 'Invalid token format (must be 6 digits)' });
    }

    const user = await User.findById(userId).select('+twoFactorSecret');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is already enabled' });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({ message: 'Please setup 2FA first' });
    }

    // Verify the token
    const isValid = verifyTOTP(token, user.twoFactorSecret);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Enable 2FA
    user.twoFactorEnabled = true;
    user.twoFactorEnabledAt = new Date();
    await user.save();

    res.json({
      message: '✅ 2FA enabled successfully!',
      enabled: true,
      enabledAt: user.twoFactorEnabledAt,
    });
  } catch (error: any) {
    console.error('Error enabling 2FA:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/2fa/disable
 * @desc    Disable 2FA
 * @access  Private
 */
export const disable2FA = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { password, token } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findById(userId).select('+password +twoFactorSecret');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is not enabled' });
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Verify 2FA token if provided
    if (token && user.twoFactorSecret) {
      const isValid = verifyTOTP(token, user.twoFactorSecret);
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid 2FA token' });
      }
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    user.twoFactorBackupCodes = undefined;
    user.twoFactorEnabledAt = undefined;
    await user.save();

    res.json({
      message: '✅ 2FA disabled successfully',
      enabled: false,
    });
  } catch (error: any) {
    console.error('Error disabling 2FA:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/2fa/verify
 * @desc    Verify 2FA token (used during login)
 * @access  Public (called with userId)
 */
export const verify2FAToken = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, token, useBackupCode } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ message: 'User ID and token are required' });
    }

    const user = await User.findById(userId).select('+twoFactorSecret +twoFactorBackupCodes');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is not enabled for this user' });
    }

    let isValid = false;

    if (useBackupCode) {
      // Verify backup code
      if (user.twoFactorBackupCodes) {
        for (let i = 0; i < user.twoFactorBackupCodes.length; i++) {
          const matches = await bcrypt.compare(token, user.twoFactorBackupCodes[i]);
          if (matches) {
            // Remove used backup code
            user.twoFactorBackupCodes.splice(i, 1);
            await user.save();
            isValid = true;
            break;
          }
        }
      }
    } else {
      // Verify TOTP token
      if (user.twoFactorSecret) {
        isValid = verifyTOTP(token, user.twoFactorSecret);
      }
    }

    if (!isValid) {
      return res.status(400).json({ 
        message: useBackupCode ? 'Invalid backup code' : 'Invalid 2FA token',
        valid: false 
      });
    }

    res.json({
      message: '2FA verification successful',
      valid: true,
    });
  } catch (error: any) {
    console.error('Error verifying 2FA:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/2fa/regenerate-backup-codes
 * @desc    Regenerate backup codes
 * @access  Private
 */
export const regenerateBackupCodes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { password } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is not enabled' });
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate new backup codes
    const backupCodes = generateBackupCodes();
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => bcrypt.hash(code, 10))
    );

    user.twoFactorBackupCodes = hashedBackupCodes;
    await user.save();

    res.json({
      message: '✅ Backup codes regenerated successfully',
      backupCodes: backupCodes, // Show once, user must save these
    });
  } catch (error: any) {
    console.error('Error regenerating backup codes:', error);
    res.status(500).json({ message: error.message });
  }
};

