import { getDatabase } from '../config/database.js';

/**
 * GET /users/me
 * Get current user's profile
 */
export function getMe(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.userId;

    // Get user data
    const user = db.prepare('SELECT id, username, email, bio, location, profilePictureUrl, createdAt FROM users WHERE id = ?').get(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Count events organized
    const eventsOrganized = db.prepare('SELECT COUNT(*) as count FROM events WHERE organizerId = ?').get(userId).count;

    // Count events attended
    const eventsAttended = db.prepare('SELECT COUNT(*) as count FROM event_attendees WHERE userId = ?').get(userId).count;

    res.status(200).json({
      userId: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      location: user.location,
      profilePictureUrl: user.profilePictureUrl,
      eventsOrganized,
      eventsAttended,
      createdAt: user.createdAt
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /users/me
 * Update current user's profile
 */
export function updateMe(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.userId;
    const { username, bio, location, profilePictureUrl } = req.body;

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];

    if (username !== undefined) {
      // Check if username is already taken by another user
      const existingUser = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, userId);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      updates.push('username = ?');
      values.push(username);
    }

    if (bio !== undefined) {
      updates.push('bio = ?');
      values.push(bio);
    }

    if (location !== undefined) {
      updates.push('location = ?');
      values.push(location);
    }

    if (profilePictureUrl !== undefined) {
      updates.push('profilePictureUrl = ?');
      values.push(profilePictureUrl);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    // Add updatedAt
    updates.push('updatedAt = ?');
    values.push(new Date().toISOString());

    // Add userId for WHERE clause
    values.push(userId);

    const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(updateQuery).run(...values);

    // Get updated user
    const user = db.prepare('SELECT id, username, email, bio, location, profilePictureUrl, createdAt, updatedAt FROM users WHERE id = ?').get(userId);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /users/:userId
 * Get public profile for a specific user
 */
export function getUserById(req, res, next) {
  try {
    const db = getDatabase();
    const { userId } = req.params;

    // Get user data (public profile only)
    const user = db.prepare('SELECT id, username, bio, location, profilePictureUrl, createdAt FROM users WHERE id = ?').get(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Count events organized
    const eventsOrganized = db.prepare('SELECT COUNT(*) as count FROM events WHERE organizerId = ?').get(userId).count;

    res.status(200).json({
      userId: user.id,
      username: user.username,
      bio: user.bio,
      location: user.location,
      profilePictureUrl: user.profilePictureUrl,
      eventsOrganized,
      createdAt: user.createdAt
    });
  } catch (error) {
    next(error);
  }
}
