import express from 'express';
import {
  getFeed,
  createPost,
  getEventPosts,
  toggleLike,
  getComments,
  createComment
} from '../controllers/postController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/feed
router.get('/feed', authenticateToken, getFeed);

// POST /api/v1/posts
router.post('/posts', authenticateToken, createPost);

// GET /api/v1/events/:eventId/posts (note: this is in postRoutes for organization)
router.get('/events/:eventId/posts', getEventPosts);

// POST /api/v1/posts/:postId/like
router.post('/posts/:postId/like', authenticateToken, toggleLike);

// GET /api/v1/posts/:postId/comments
router.get('/posts/:postId/comments', getComments);

// POST /api/v1/posts/:postId/comments
router.post('/posts/:postId/comments', authenticateToken, createComment);

export default router;
