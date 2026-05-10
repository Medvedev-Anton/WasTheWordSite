import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { BankController } from '../controllers/bank_controller.js';

const router = express.Router();

// Получение параметров банка
router.get('/:bankId/params', authenticateToken, (req, res) => {
    try {
        const controller = new BankController(req, res);
        controller.getLoanParams();
    }
    catch (error) {
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
    catch (error) {
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
    catch (error) {
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
    catch (error) {
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
    catch (error) {
        console.error('Update users percent bank error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Получение всех заемщиков-пользователей банка
router.get('/:bankId/borrowers/users', authenticateToken, (req, res) => {
    try {
        const controller = new BankController(req, res);
        controller.getUsersBorrowers();
    }
    catch (error) {
        console.error('Get bank users borrowers error:', error);
        res.status(500).json({ error: 'Server error' });
    }
})

// Получение всех заемщиков-организаций банка
router.get('/:bankId/borrowers/users', authenticateToken, (req, res) => {
    try {
        const controller = new BankController(req, res);
        controller.getOrgsBorrowers();
    }
    catch (error) {
        console.error('Get bank orgs borrowers error:', error);
        res.status(500).json({ error: 'Server error' });
    }
})

export default router;