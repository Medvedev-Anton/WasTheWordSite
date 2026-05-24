import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { OrgCreationController } from '../controllers/org_creation_controller.js';

const router = express.Router();

// Получение всех цен организаций
router.get('/all', authenticateToken, (req, res) => {
    const controller = new OrgCreationController(req, res);
    controller.getAllPrices();
});

// Обновление цены организации
router.post('/', authenticateToken, (req, res) => {
    const controller = new OrgCreationController(req, res);
    controller.updatePrice();
});

export default router;