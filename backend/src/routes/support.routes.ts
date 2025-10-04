import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getTickets,
  respondToTicket,
  getForumPosts,
  createAnnouncement,
} from '../controllers/support.controller';

const router = express.Router();

// All routes require authentication and support role
router.use(protect);
router.use(authorize('support'));

router.get('/tickets', getTickets);
router.post('/tickets/:id/respond', respondToTicket);
router.get('/forum', getForumPosts);
router.post('/announcements', createAnnouncement);

export default router;

