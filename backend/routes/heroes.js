import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../database/init.js';

const router = express.Router();

// GET /heroes
router.get('/', authenticateToken, (req, res) => {
    try {
        const heroes = db.prepare(`
            SELECT * FROM heroes    
        `).all();

        res.json({ heroes: heroes });
    }
    catch (error) {
        console.error('Error fetching heroes:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;