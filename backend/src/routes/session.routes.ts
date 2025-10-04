import express from 'express';
import {
  getSessions,
  logoutSession,
  logoutAllSessions,
  updateSessionActivity,
} from '../controllers/session.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getSessions);
router.delete('/:sessionId', logoutSession);
router.post('/logout-all', logoutAllSessions);
router.post('/update-activity', updateSessionActivity);

export default router;

