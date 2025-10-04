import express from 'express';
import {
  getKYCStatus,
  submitLevel1,
  submitLevel2,
  submitLevel3,
  approveKYC,
  rejectKYC,
  getPendingKYC,
  resetKYC,
  upload,
} from '../controllers/kyc.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// All KYC routes require authentication
router.use(protect);

// Get current user's KYC status
router.get('/status', getKYCStatus);

// Submit Level 1 (Personal Information)
router.post('/level1', submitLevel1);

// Submit Level 2 (Document Upload)
router.post('/level2', upload.fields([
  { name: 'idCard', maxCount: 1 },
  { name: 'passport', maxCount: 1 },
  { name: 'driverLicense', maxCount: 1 }
]), submitLevel2);

// Submit Level 3 (Video Verification)
router.post('/level3', submitLevel3);

// Reset KYC (user can restart verification)
router.post('/reset', resetKYC);

// Admin routes
router.get('/pending', getPendingKYC); // Get all pending KYC requests
router.post('/approve/:userId', approveKYC); // Approve a user's KYC
router.post('/reject/:userId', rejectKYC); // Reject a user's KYC

export default router;

