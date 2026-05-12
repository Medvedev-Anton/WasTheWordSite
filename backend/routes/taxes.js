import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { TaxController } from '../controllers/tax_controller.js';

const router = express.Router();

// Получение налога пользователей
router.get('/users', authenticateToken, (req, res) => {
    const controller = new TaxController(req, res);
    controller.getUsersTax();
});

// Получение налога организаций
router.get('/orgs', authenticateToken, (req, res) => {
    const controller = new TaxController(req, res);
    controller.getOrgsTax();
});

// Обновление налога пользователей
router.post('/users', authenticateToken, (req, res) => {
    const controller = new TaxController(req, res);
    controller.updateUsersTax();
});

// Обновление налога организаций
router.post('/orgs', authenticateToken, (req, res) => {
    const controller = new TaxController(req, res);
    controller.updateOrgsTax();
});

export default router;