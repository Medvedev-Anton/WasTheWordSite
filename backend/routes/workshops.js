import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import WorkshopsController from '../controllers/workshops_controller.js';

const router = express.Router();

router.get('/:id/simple-item', authenticateToken, (req, res) => {
    const controller = new WorkshopsController(req, res);
    controller.getSimpleItem();
});

export default router;