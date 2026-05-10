import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Получение параметров банка
router.get('/:bankId/params', authenticateToken, (req, res) => {
    try {
        const controller = new BankController(req, res);
        controller.getLoanParams();
    }
    catch (e) {
        console.error('Get bank params error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Обновление процента по кредиту для пользователей
router.post('/:bankId/params/users-loan-percent', authenticateToken, (req, res) => {
    try {
        const controller = new BankController(req, res);
        controller.updateUsersLoanPercent();
    }
    catch (e) {
        console.error('Update users percent bank error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Обновление срока кредита для пользователей
router.post('/:bankId/params/users-loan-during', authenticateToken, (req, res) => {
    try {
        const controller = new BankController(req, res);
        controller.updateUsersLoanDuring();
    }
    catch (e) {
        console.error('Update users percent bank error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Обновление процента по кредиту для организаций
router.post('/:bankId/params/orgs-loan-percent', authenticateToken, (req, res) => {
    try {
        const controller = new BankController(req, res);
        controller.updateOrgsLoanPercent();
    }
    catch (e) {
        console.error('Update users percent bank error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Обновление срока кредита для организаций
router.post('/:bankId/params/orgs-loan-during', authenticateToken, (req, res) => {
    try {
        const controller = new BankController(req, res);
        controller.updateOrgsLoanDuring();
    }
    catch (e) {
        console.error('Update users percent bank error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;