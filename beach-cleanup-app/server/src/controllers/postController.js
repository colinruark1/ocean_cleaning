import { getDatabase } from '../config/database.js';
import { randomUUID } from 'crypto';

/**
 * GET /feed
 * Get personalized feed for current user
 */
export function getFeed(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.userId;

    // Get posts from:
    // 1. Users the current user follows
    // 2. Events the current user is attending or organizing
    // 3. The user's own posts
    const posts = db.prepare(`
      SELECT DISTINCT p.*, u.username as authorName, u.profilePictureUrl as authorProfilePic
      FROM posts p
      JOIN users u ON p.authorId = u.id
      LEFT JOIN user_follows uf ON p.authorId = uf.followingId AND uf.followerId = ?
      LEFT JOIN event_attendees ea ON p.eventId = ea.eventId AND ea.userId = ?
      LEFT JOIN events e ON p.eventId = e.id
      WHERE p.authorId = ?
         OR uf.followerId = ?
         OR ea.userId = ?
         OR e.organizerId = ?
      ORDER BY p.createdAt DESC
      LIMIT 50
    `).all(userId, userId, userId, userId, userId, userId);

    // Get likes and comments count for each post
    const postsWithCounts = posts.map(post => {
      const likes = db.prepare('SELECT COUNT(*) as count FROM post_likes WHERE postId = ?').get(post.id).count;
      const comments = db.prepare('SELECT COUNT(*) as count FROM comments WHERE postId = ?').get(post.id).count;

      return {
        postId: post.id,
        author: {
          userId: post.authorId,
          username: post.authorName,
          profilePictureUrl: post.authorProfilePic
        },
        text: post.text,
        imageUrl: post.imageUrl,
        eventId: post.eventId,
        likes,
        comments,
        createdAt: post.createdAt
      };
    });

    res.status(200).json(postsWithCounts);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /posts
 * Create a new post
 */
export function createPost(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.userId;
    const { text, imageUrl, eventId } = req.body;

    // Validation
    if (!text) {
      return res.status(400).json({ error: 'Post text is required' });
    }

    // If eventId provided, verify it exists
    if (eventId) {
      const event = db.prepare('SELECT id FROM events WHERE id = ?').get(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
    }

    const postId = randomUUID();
    const now = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO posts (id, text, imageUrl, authorId, eventId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(postId, text, imageUrl || null, userId, eventId || null, now, now);

    // Get created post with author info
    const post = db.prepare(`
      SELECT p.*, u.username as authorName, u.profilePictureUrl as authorProfilePic
      FROM posts p
      JOIN users u ON p.authorId = u.id
      WHERE p.id = ?
    `).get(postId);

    res.status(201).json({
      postId: post.id,
      author: {
        userId: post.authorId,
        username: post.authorName,
        profilePictureUrl: post.authorProfilePic
      },
      text: post.text,
      imageUrl: post.imageUrl,
      eventId: post.eventId,
      likes: 0,
      comments: 0,
      createdAt: post.createdAt
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /events/:eventId/posts
 * Get all posts for a specific event
 */
export function getEventPosts(req, res, next) {
  try {
    const db = getDatabase();
    const { eventId } = req.params;

    // Check if event exists
    const event = db.prepare('SELECT id FROM events WHERE id = ?').get(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const posts = db.prepare(`
      SELECT p.*, u.username as authorName, u.profilePictureUrl as authorProfilePic
      FROM posts p
      JOIN users u ON p.authorId = u.id
      WHERE p.eventId = ?
      ORDER BY p.createdAt DESC
    `).all(eventId);

    const postsWithCounts = posts.map(post => {
      const likes = db.prepare('SELECT COUNT(*) as count FROM post_likes WHERE postId = ?').get(post.id).count;
      const comments = db.prepare('SELECT COUNT(*) as count FROM comments WHERE postId = ?').get(post.id).count;

      return {
        postId: post.id,
        author: {
          userId: post.authorId,
          username: post.authorName,
          profilePictureUrl: post.authorProfilePic
        },
        text: post.text,
        imageUrl: post.imageUrl,
        likes,
        comments,
        createdAt: post.createdAt
      };
    });

    res.status(200).json(postsWithCounts);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /posts/:postId/like
 * Like or unlike a post
 */
export function toggleLike(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.userId;
    const { postId } = req.params;

    // Check if post exists
    const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if already liked
    const existing = db.prepare('SELECT * FROM post_likes WHERE postId = ? AND userId = ?').get(postId, userId);

    if (existing) {
      // Unlike
      db.prepare('DELETE FROM post_likes WHERE postId = ? AND userId = ?').run(postId, userId);
      res.status(200).json({ message: 'Post unliked', liked: false });
    } else {
      // Like
      db.prepare(`
        INSERT INTO post_likes (postId, userId, likedAt)
        VALUES (?, ?, ?)
      `).run(postId, userId, new Date().toISOString());
      res.status(200).json({ message: 'Post liked', liked: true });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * GET /posts/:postId/comments
 * Get all comments for a post
 */
export function getComments(req, res, next) {
  try {
    const db = getDatabase();
    const { postId } = req.params;

    // Check if post exists
    const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comments = db.prepare(`
      SELECT c.*, u.username as authorName, u.profilePictureUrl as authorProfilePic
      FROM comments c
      JOIN users u ON c.authorId = u.id
      WHERE c.postId = ?
      ORDER BY c.createdAt ASC
    `).all(postId);

    const formattedComments = comments.map(comment => ({
      commentId: comment.id,
      author: {
        userId: comment.authorId,
        username: comment.authorName,
        profilePictureUrl: comment.authorProfilePic
      },
      text: comment.text,
      createdAt: comment.createdAt
    }));

    res.status(200).json(formattedComments);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /posts/:postId/comments
 * Add a comment to a post
 */
export function createComment(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.userId;
    const { postId } = req.params;
    const { text } = req.body;

    // Validation
    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    // Check if post exists
    const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const commentId = randomUUID();
    const now = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO comments (id, postId, authorId, text, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `);

    insert.run(commentId, postId, userId, text, now);

    // Get created comment with author info
    const comment = db.prepare(`
      SELECT c.*, u.username as authorName, u.profilePictureUrl as authorProfilePic
      FROM comments c
      JOIN users u ON c.authorId = u.id
      WHERE c.id = ?
    `).get(commentId);

    res.status(201).json({
      commentId: comment.id,
      author: {
        userId: comment.authorId,
        username: comment.authorName,
        profilePictureUrl: comment.authorProfilePic
      },
      text: comment.text,
      createdAt: comment.createdAt
    });
  } catch (error) {
    next(error);
  }
}
