import express from 'express';
import { getMe, updateMe, getUserById } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/users/me
router.get('/me', authenticateToken, getMe);

// PATCH /api/v1/users/me
router.patch('/me', authenticateToken, updateMe);

// GET /api/v1/users/:userId
router.get('/:userId', getUserById);

export default router;
