import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { PricesController } from '../controllers/prices_controller.js';

const router = express.Router();

// Получение цены за просмотр поста
router.get('/post-view', authenticateToken, (req, res) => {
    const controller = new PricesController(req, res);
    controller.getPostViewPrice();
});

// Получение цены за создание организации
router.get('/org-create', authenticateToken, (req, res) => {
    const controller = new PricesController(req, res);
    controller.getOrgCreatePrice();
});

// Обновление цены за просмотр поста
router.post('/post-view', authenticateToken, (req, res) => {
    const controller = new PricesController(req, res);
    controller.updatePostViewPrice();
});

// Обновление цены за создание организации
router.post('/org-create', authenticateToken, (req, res) => {
    const controller = new PricesController(req, res);
    controller.updateOrgCreatePrice();
});

export default router;