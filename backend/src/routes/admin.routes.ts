import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getAllUsers,
  updateUserStatus,
  getAllAssets,
  createAsset,
  updateAsset,
  getAllTransactions,
  getDashboardStats,
} from '../controllers/admin.controller';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/assets', getAllAssets);
router.post('/assets', createAsset);
router.patch('/assets/:id', updateAsset);
router.get('/transactions', getAllTransactions);
router.get('/dashboard', getDashboardStats);

export default router;

