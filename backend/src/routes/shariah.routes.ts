import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getPendingAssets,
  reviewAsset,
  issueFatwa,
  getComplianceReports,
} from '../controllers/shariah.controller';

const router = express.Router();

// All routes require authentication and shariah_board role
router.use(protect);
router.use(authorize('shariah_board'));

router.get('/assets/pending', getPendingAssets);
router.patch('/assets/:id/review', reviewAsset);
router.post('/assets/:id/fatwa', issueFatwa);
router.get('/reports', getComplianceReports);

export default router;

