import express from 'express';
import { validateAdmin, getAdminProfile } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', validateAdmin);
router.get('/profile', protect, getAdminProfile);

export default router;