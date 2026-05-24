import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { OrgCreationPriceController } from '../controllers/org_creation_price_controller.js';

const router = express.Router();

// Получение всех цен организаций
router.get('/all', authenticateToken, (req, res) => {
    const controller = new OrgCreationPriceController(req, res);
    controller.getAllPrices();
});

// Обновление цены организации
router.post('/', authenticateToken, (req, res) => {
    const controller = new OrgCreationPriceController(req, res);
    controller.updatePrice();
});

export default router;