import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { TaxController } from '../controllers/tax_controller.js';

const router = express.Router();

// Получение налога пользователей
router.get('/users', authenticateToken, (req, res) => {
    const controller = new TaxController(req, res);
    controller.getUsersTaxPercent();
});

// Получение налога организации
router.get('/orgs', authenticateToken, (req, res) => {
    const controller = new TaxController(req, res);
    controller.getOrgsTaxPercent();
});

// Получение всех налогов организаций
router.get('/orgs/all', authenticateToken, (req, res) => {
    const controller = new TaxController(req, res);
    controller.getAllOrgsTaxesPercents();
});

// Обновление налога пользователей
router.post('/users', authenticateToken, (req, res) => {
    const controller = new TaxController(req, res);
    controller.updateUsersTaxPercent();
});

// Обновление налога организаций
router.post('/orgs', authenticateToken, (req, res) => {
    const controller = new TaxController(req, res);
    controller.updateOrgsTaxPercent();
});

export default router;