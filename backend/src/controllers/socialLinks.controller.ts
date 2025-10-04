import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User.model';

/**
 * Social Links Controller - Handles social media links management
 * 
 * Features:
 * - Get social links
 * - Update social links (add/update)
 * - Remove social link
 * - Validate URLs
 */

// Helper function to validate URL format
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to validate specific social media URLs
const validateSocialUrl = (platform: string, url: string): { valid: boolean; message?: string } => {
  if (!url || url.trim() === '') {
    return { valid: true }; // Empty is valid (means user wants to remove)
  }

  if (!isValidUrl(url)) {
    return { valid: false, message: 'Invalid URL format' };
  }

  const urlLower = url.toLowerCase();

  switch (platform) {
    case 'twitter':
      if (!urlLower.includes('twitter.com') && !urlLower.includes('x.com')) {
        return { valid: false, message: 'URL must be from twitter.com or x.com' };
      }
      break;
    case 'facebook':
      if (!urlLower.includes('facebook.com') && !urlLower.includes('fb.com')) {
        return { valid: false, message: 'URL must be from facebook.com' };
      }
      break;
    case 'instagram':
      if (!urlLower.includes('instagram.com')) {
        return { valid: false, message: 'URL must be from instagram.com' };
      }
      break;
    case 'website':
      // Any valid URL is acceptable for website
      break;
  }

  return { valid: true };
};

/**
 * @route   GET /api/social-links
 * @desc    Get user's social links
 * @access  Private
 */
export const getSocialLinks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('socialLinks');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize socialLinks if not exists
    const socialLinks = user.socialLinks || {
      twitter: '',
      facebook: '',
      instagram: '',
      website: '',
    };

    res.json({
      socialLinks: {
        twitter: socialLinks.twitter || '',
        facebook: socialLinks.facebook || '',
        instagram: socialLinks.instagram || '',
        website: socialLinks.website || '',
      },
    });
  } catch (error: any) {
    console.error('Error getting social links:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/social-links
 * @desc    Update social links (add or update)
 * @access  Private
 */
export const updateSocialLinks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { twitter, facebook, instagram, website } = req.body;

    // Validate each provided URL
    const validations: { [key: string]: string } = {};

    if (twitter !== undefined) {
      const validation = validateSocialUrl('twitter', twitter);
      if (!validation.valid) {
        validations.twitter = validation.message || 'Invalid Twitter URL';
      }
    }

    if (facebook !== undefined) {
      const validation = validateSocialUrl('facebook', facebook);
      if (!validation.valid) {
        validations.facebook = validation.message || 'Invalid Facebook URL';
      }
    }

    if (instagram !== undefined) {
      const validation = validateSocialUrl('instagram', instagram);
      if (!validation.valid) {
        validations.instagram = validation.message || 'Invalid Instagram URL';
      }
    }

    if (website !== undefined) {
      const validation = validateSocialUrl('website', website);
      if (!validation.valid) {
        validations.website = validation.message || 'Invalid Website URL';
      }
    }

    // If there are validation errors, return them
    if (Object.keys(validations).length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validations,
      });
    }

    // Update user's social links
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize socialLinks if not exists
    if (!user.socialLinks) {
      user.socialLinks = {
        twitter: '',
        facebook: '',
        instagram: '',
        website: '',
      };
    }

    // Update only provided fields
    if (twitter !== undefined) user.socialLinks.twitter = twitter.trim();
    if (facebook !== undefined) user.socialLinks.facebook = facebook.trim();
    if (instagram !== undefined) user.socialLinks.instagram = instagram.trim();
    if (website !== undefined) user.socialLinks.website = website.trim();

    await user.save();

    res.json({
      message: '✅ Social links updated successfully',
      socialLinks: user.socialLinks,
    });
  } catch (error: any) {
    console.error('Error updating social links:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/social-links/:platform
 * @desc    Remove a social link
 * @access  Private
 */
export const removeSocialLink = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { platform } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!['twitter', 'facebook', 'instagram', 'website'].includes(platform)) {
      return res.status(400).json({ message: 'Invalid platform' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.socialLinks) {
      return res.status(404).json({ message: 'No social links found' });
    }

    // Remove the specific platform link
    user.socialLinks[platform as keyof typeof user.socialLinks] = '';
    await user.save();

    res.json({
      message: `✅ ${platform.charAt(0).toUpperCase() + platform.slice(1)} link removed`,
      socialLinks: user.socialLinks,
    });
  } catch (error: any) {
    console.error('Error removing social link:', error);
    res.status(500).json({ message: error.message });
  }
};

