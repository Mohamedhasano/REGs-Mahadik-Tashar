import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import LoginSession from '../models/LoginSession.model';
import crypto from 'crypto';

/**
 * Session Controller - Handles login session management
 * 
 * Features:
 * - Get all active sessions
 * - Logout from specific session
 * - Logout from all sessions (except current)
 * - Update last active time
 */

/**
 * @route   GET /api/sessions
 * @desc    Get all active sessions for current user
 * @access  Private
 */
export const getSessions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get current token to mark current session
    const currentToken = req.headers.authorization?.replace('Bearer ', '');
    const currentTokenHash = currentToken ? crypto.createHash('sha256').update(currentToken).digest('hex') : '';

    // Get all active sessions
    const sessions = await LoginSession.find({
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() }, // Not expired
    }).sort({ lastActive: -1 });

    // Format sessions for response
    const formattedSessions = sessions.map(session => {
      // Check if this is the current session
      const isCurrentSession = session.token === currentTokenHash;
      
      return {
        id: session._id,
        deviceName: session.deviceName,
        deviceType: session.deviceType,
        browser: session.browser,
        os: session.os,
        ipAddress: session.ipAddress,
        location: session.location || 'Unknown',
        isCurrent: isCurrentSession,
        lastActive: session.lastActive,
        createdAt: session.createdAt,
      };
    });

    res.json({
      sessions: formattedSessions,
      total: formattedSessions.length,
    });
  } catch (error: any) {
    console.error('Error getting sessions:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/sessions/:sessionId
 * @desc    Logout from specific session
 * @access  Private
 */
export const logoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { sessionId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    // Find and deactivate the session
    const session = await LoginSession.findOne({
      _id: sessionId,
      userId,
      isActive: true,
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found or already logged out' });
    }

    // Deactivate session
    session.isActive = false;
    await session.save();

    // Or delete it completely
    // await LoginSession.findByIdAndDelete(sessionId);

    res.json({
      message: '✅ Session logged out successfully',
      sessionId: session._id,
    });
  } catch (error: any) {
    console.error('Error logging out session:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/sessions/logout-all
 * @desc    Logout from all sessions except current
 * @access  Private
 */
export const logoutAllSessions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get current token to preserve current session
    const currentToken = req.headers.authorization?.replace('Bearer ', '');
    const currentTokenHash = currentToken ? crypto.createHash('sha256').update(currentToken).digest('hex') : '';

    // Deactivate all sessions except current
    const result = await LoginSession.updateMany(
      {
        userId,
        isActive: true,
        token: { $ne: currentTokenHash }, // Exclude current session
      },
      {
        $set: { isActive: false },
      }
    );

    res.json({
      message: `✅ Logged out from ${result.modifiedCount} device(s)`,
      loggedOutCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.error('Error logging out all sessions:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/sessions/update-activity
 * @desc    Update last active time for current session
 * @access  Private
 */
export const updateSessionActivity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get current token
    const currentToken = req.headers.authorization?.replace('Bearer ', '');
    if (!currentToken) {
      return res.status(400).json({ message: 'No token provided' });
    }

    const currentTokenHash = crypto.createHash('sha256').update(currentToken).digest('hex');

    // Update session last active time
    const session = await LoginSession.findOneAndUpdate(
      {
        userId,
        token: currentTokenHash,
        isActive: true,
      },
      {
        $set: { lastActive: new Date() },
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({
      message: 'Session activity updated',
      lastActive: session.lastActive,
    });
  } catch (error: any) {
    console.error('Error updating session activity:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Helper function to create a new session (called from login)
 */
export const createSession = async (
  userId: string,
  token: string,
  req: any
): Promise<void> => {
  try {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';

    // Parse user agent
    const { browser, os, deviceType, deviceName } = (LoginSession as any).parseUserAgent(userAgent);

    // Hash token for storage
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Calculate expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Mark all other sessions as not current
    await LoginSession.updateMany(
      { userId, isCurrent: true },
      { $set: { isCurrent: false } }
    );

    // Create new session
    await LoginSession.create({
      userId,
      token: tokenHash,
      deviceType,
      deviceName,
      browser,
      os,
      ipAddress,
      location: 'Unknown', // TODO: Add IP geolocation
      userAgent,
      isActive: true,
      isCurrent: true,
      lastActive: new Date(),
      expiresAt,
    });
  } catch (error: any) {
    console.error('Error creating session:', error);
    // Don't throw error, just log it
  }
};

