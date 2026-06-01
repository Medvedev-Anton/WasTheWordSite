import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import NotificationsController from '../controllers/notifications_controller.js';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    const controller = new NotificationsController(req, res);
    controller.getAllUserNotifications();
});

export default router;