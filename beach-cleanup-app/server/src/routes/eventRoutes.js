import express from 'express';
import {
  getAllEvents,
  createEvent,
  getEventById,
  joinEvent,
  leaveEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/events
router.get('/', getAllEvents);

// POST /api/v1/events
router.post('/', authenticateToken, createEvent);

// GET /api/v1/events/:eventId
router.get('/:eventId', getEventById);

// POST /api/v1/events/:eventId/join
router.post('/:eventId/join', authenticateToken, joinEvent);

// DELETE /api/v1/events/:eventId/leave
router.delete('/:eventId/leave', authenticateToken, leaveEvent);

// DELETE /api/v1/events/:eventId
router.delete('/:eventId', authenticateToken, deleteEvent);

export default router;
