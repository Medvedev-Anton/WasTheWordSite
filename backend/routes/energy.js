import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import EnergyController from '../controllers/energy_controller.js';
import EnergyParamsController from '../controllers/energy_params_controller.js';
const router = express.Router();

// Начисление энергии за посещение организации
router.post('/org/:id/visit', authenticateToken, (req, res) => {
    const controller = new EnergyController(req, res);
    controller.incrementForOrgVisit();
});

// Получение значения параметра цены за покупку энергии
router.get('/params/buyEnergyPrice', authenticateToken, (req, res) => {
    const controller = new EnergyParamsController(req, res);
    controller.getBuyEnergyPrice();
});

// Обновление значения параметра цены за покупку энергии
router.post('/params/buyEnergyPrice', authenticateToken, (req, res) => {
    const controller = new EnergyParamsController(req, res);
    controller.updateBuyEnergyPrice();
});

export default router;