import { authenticateToken } from './auth.js';
import { db } from '../database/init.js';

export function requireAdmin(req, res, next) {
  authenticateToken(req, res, () => {
    const user = db.prepare('SELECT role, isBanned FROM users WHERE id = ?').get(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isBanned) {
      return res.status(403).json({ error: 'Your account has been banned' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  });
}








