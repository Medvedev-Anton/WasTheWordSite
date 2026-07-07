import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import FarmsController from '../controllers/farms_controller.js';
const router = express.Router();

router.get('/:id/resource', authenticateToken, (req, res) => {
    const controller = new FarmsController(req, res);
    controller.getFarmResource();
});

export default router;