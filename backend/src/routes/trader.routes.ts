import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getPortfolio,
  getTransactionHistory,
  createOrder,
  calculateZakat,
  getStakingPools,
  stakeAssets,
} from '../controllers/trader.controller';

const router = express.Router();

// All routes require authentication and trader role
router.use(protect);
router.use(authorize('trader'));

router.get('/portfolio', getPortfolio);
router.get('/transactions', getTransactionHistory);
router.post('/order', createOrder);
router.get('/zakat', calculateZakat);
router.get('/staking/pools', getStakingPools);
router.post('/staking/stake', stakeAssets);

export default router;

