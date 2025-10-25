import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../config/database.js';
import { randomUUID } from 'crypto';

/**
 * Generate JWT token for a user
 */
function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * POST /auth/register
 * Register a new user
 */
export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const db = getDatabase();

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email or username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = randomUUID();
    const now = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO users (id, username, email, password, bio, profilePictureUrl, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(userId, username, email, hashedPassword, null, null, now, now);

    // Get created user (without password)
    const user = db.prepare('SELECT id, username, email, bio, profilePictureUrl, createdAt FROM users WHERE id = ?').get(userId);

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      token,
      user
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /auth/login
 * Login existing user
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDatabase();

    // Get user by email
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Remove password from response
    delete user.password;

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      token,
      user
    });
  } catch (error) {
    next(error);
  }
}
