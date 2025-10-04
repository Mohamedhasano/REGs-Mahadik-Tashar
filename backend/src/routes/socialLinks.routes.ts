import express from 'express';
import {
  getSocialLinks,
  updateSocialLinks,
  removeSocialLink,
} from '../controllers/socialLinks.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getSocialLinks);
router.put('/', updateSocialLinks);
router.delete('/:platform', removeSocialLink);

export default router;

