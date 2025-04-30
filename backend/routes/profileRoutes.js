import express from 'express';
import { updateProfile } from '../controllers/profileController.js';

const router = express.Router();

router.put('/updateProfile', updateProfile);

export default router;