import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { RangController } from '../controllers/rang_controller.js';

const router = express.Router();

// Get all rangs
router.get('/', authenticateToken, (req, res) => {
    const controller = new RangController(req, res);
    controller.findAll();
});

// Create rang
router.post('/', authenticateToken, (req, res) => {
    const controller = new RangController(req, res);
    controller.create();
});

// Delete rang
router.delete('/:id', authenticateToken, (req, res) => {
    const controller = new RangController(req, res);
    controller.delete();
});

// Find user rang
router.get('/user-rang', authenticateToken, (req, res) => {
    const controller = new RangController(req, res);
    controller.findByUserId();
});

export default router;