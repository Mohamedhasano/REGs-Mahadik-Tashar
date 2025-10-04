import express from 'express';
import {
  calculateZakat,
  getZakatHistory,
  getZakatCalculation,
  markZakatAsPaid,
  getNisabValues,
  deleteZakatCalculation,
} from '../controllers/zakat.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public route (or can be protected)
router.get('/nisab', getNisabValues);

// All other routes require authentication
router.use(protect);

router.post('/calculate', calculateZakat);
router.get('/history', getZakatHistory);
router.get('/calculation/:id', getZakatCalculation);
router.post('/mark-paid/:id', markZakatAsPaid);
router.delete('/calculation/:id', deleteZakatCalculation);

export default router;

