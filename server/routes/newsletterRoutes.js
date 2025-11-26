import express from 'express';
import { subscribe, list } from '../controllers/newsletterController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public subscribe endpoint
router.post('/subscribe', subscribe);

// Admin-only list
router.get('/', authenticate, authorize('admin'), list);

export default router;
