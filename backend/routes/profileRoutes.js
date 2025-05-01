import express from 'express';
import { updateProfile, deleteProfile } from '../controllers/profileController.js';

const router = express.Router();

router.put('/updateProfile', updateProfile);
router.delete('/deleteProfile/:id', deleteProfile);

export default router;