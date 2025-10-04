import express from 'express';
import {
  getPasswordInfo,
  changePassword,
  validatePasswordStrength,
} from '../controllers/password.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication except validate-strength
router.get('/info', protect, getPasswordInfo);
router.post('/change', protect, changePassword);
router.post('/validate-strength', validatePasswordStrength); // Public for registration forms

export default router;

