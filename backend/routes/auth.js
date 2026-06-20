import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/init.js';
import { InitialBalancesFacade } from '../facades/initial_balances_facade.js';
import EnergyFacade from '../facades/energy_facade.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, gender } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }

    if (gender != 'M' && gender != 'F') {
      return res.status(400).json({ error: 'gender must be either male or female' });
    }

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Initial balance
    const initialBalance = InitialBalancesFacade.getUserInitialBalance();

    // Create user
    const result = db.prepare(`
      INSERT INTO users (username, email, password, firstName, lastName, role, isBanned, balance, gender, energy)
      VALUES (?, ?, ?, ?, ?, 'user', 0, ?, ?, 1)
    `).run(username, email, hashedPassword, firstName || null, lastName || null, initialBalance, gender);

    const user = db.prepare('SELECT id, username, email, firstName, lastName, avatar, role, isBanned FROM users WHERE id = ?').get(result.lastInsertRowid);

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(username, username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    if (user.isBanned) {
      return res.status(403).json({ error: 'Your account has been banned' });
    }

    EnergyFacade.incrementUser(user.id, 1);

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = db.prepare('SELECT id, username, email, firstName, lastName, age, work, about, avatar, role, isBanned, gender FROM users WHERE id = ?').get(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;

