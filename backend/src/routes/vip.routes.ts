import express from 'express';
import {
  getVIPStatus,
  addTradingVolume,
  getAllVIPBenefits,
  setUserVIPLevel,
} from '../controllers/vip.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// All VIP routes require authentication
router.use(protect);

// Get current user's VIP status
router.get('/status', getVIPStatus);

// Add trading volume (for testing or when user completes a trade)
router.post('/add-volume', addTradingVolume);

// Get all VIP benefits information
router.get('/benefits', getAllVIPBenefits);

// Admin: Set user VIP level manually
router.post('/set-level/:userId', setUserVIPLevel);

export default router;

