import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// POST /api/v1/auth/register
router.post('/register', register);

// POST /api/v1/auth/login
router.post('/login', login);

export default router;
