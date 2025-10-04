import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword,
  oauthCallback,
  getReferralStats,
  validateReferralCode
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/oauth/:provider', oauthCallback);
router.get('/referral-stats', protect, getReferralStats);
router.get('/validate-referral/:code', validateReferralCode);

export default router;
