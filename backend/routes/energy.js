import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import EnergyController from '../controllers/energy_controller.js';
const router = express.Router();

router.post('/org/:id/visit', authenticateToken, (req, res) => {
    const controller = new EnergyController(req, res);
    controller.incrementForOrgVisit();
});

export default router;