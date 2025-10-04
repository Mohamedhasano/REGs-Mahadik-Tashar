import mongoose, { Document, Schema } from 'mongoose';

/**
 * Login Session Model
 * Tracks user login sessions across devices
 */

export interface ILoginSession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string; // JWT token (hashed)
  deviceType: string; // 'desktop', 'mobile', 'tablet'
  deviceName: string; // 'Chrome on Windows', 'Safari on iPhone'
  browser: string; // 'Chrome', 'Safari', 'Firefox'
  os: string; // 'Windows', 'macOS', 'iOS', 'Android'
  ipAddress: string;
  location?: string; // City, Country (from IP geolocation)
  userAgent: string; // Full user agent string
  isActive: boolean;
  isCurrent: boolean; // True for the current session
  lastActive: Date;
  createdAt: Date;
  expiresAt: Date;
}

const LoginSessionSchema = new Schema<ILoginSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      select: false, // Don't return in queries by default (security)
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
      default: 'unknown',
    },
    deviceName: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    os: {
      type: String,
      default: 'Unknown',
    },
    ipAddress: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: 'Unknown',
    },
    userAgent: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
LoginSessionSchema.index({ userId: 1, isActive: 1 });
LoginSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-cleanup

// Helper method to parse user agent
LoginSessionSchema.statics.parseUserAgent = function(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  // Detect browser
  let browser = 'Unknown';
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome/')) browser = 'Chrome';
  else if (ua.includes('firefox/')) browser = 'Firefox';
  else if (ua.includes('safari/') && !ua.includes('chrome/')) browser = 'Safari';
  else if (ua.includes('opr/')) browser = 'Opera';
  
  // Detect OS
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  // Detect device type
  let deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown' = 'unknown';
  if (ua.includes('mobile')) deviceType = 'mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) deviceType = 'tablet';
  else if (ua.includes('windows') || ua.includes('mac') || ua.includes('linux')) deviceType = 'desktop';
  
  // Generate device name
  const deviceName = `${browser} on ${os}`;
  
  return { browser, os, deviceType, deviceName };
};

export default mongoose.model<ILoginSession>('LoginSession', LoginSessionSchema);

