import express from 'express';
import {
  get2FAStatus,
  setup2FA,
  enable2FA,
  disable2FA,
  verify2FAToken,
  regenerateBackupCodes,
} from '../controllers/twoFactor.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication except verify (used during login)
router.get('/status', protect, get2FAStatus);
router.post('/setup', protect, setup2FA);
router.post('/enable', protect, enable2FA);
router.post('/disable', protect, disable2FA);
router.post('/verify', verify2FAToken); // Public (but requires userId)
router.post('/regenerate-backup-codes', protect, regenerateBackupCodes);

export default router;

