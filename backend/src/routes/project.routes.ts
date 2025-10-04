import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getMyProjects,
  createProject,
  updateProject,
  submitProject,
  getProjectDetails,
} from '../controllers/project.controller';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes for project owners
router.get('/my-projects', authorize('project'), getMyProjects);
router.post('/', authorize('project'), createProject);
router.patch('/:id', authorize('project'), updateProject);
router.post('/:id/submit', authorize('project'), submitProject);

// Public route (for all authenticated users)
router.get('/:id', getProjectDetails);

export default router;

