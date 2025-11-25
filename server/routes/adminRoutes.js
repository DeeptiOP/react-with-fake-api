import express from 'express';
import {
  getDashboardStats,
  getUserActivity,
  getSystemLogs,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/activity', getUserActivity);
router.get('/logs', getSystemLogs);

export default router;
