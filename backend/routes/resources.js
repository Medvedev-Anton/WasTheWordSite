import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import ResourcesController from '../controllers/resources_controller.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads', 'resources');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
const resourceMediaUpload = upload.fields([
  { name: 'image', maxCount: 1 },
]);

// Получить все ресурсы
router.get('/', authenticateToken, (req, res) => {
    const controller = new ResourcesController(req, res);
    controller.getAll();
});

// Создать ресурс
router.post('/', authenticateToken, resourceMediaUpload, (req, res) => {
    const controller = new ResourcesController(req, res);
    controller.create();
});

// Получить ресурс
router.get('/:id', authenticateToken, (req, res) => {
    const controller = new ResourcesController(req, res);
    controller.getById();
});

// Удалить ресурс
router.delete('/:id', authenticateToken, (req, res) => {
    const controller = new ResourcesController(req, res);
    controller.delete();
});

// Изменить номер
router.patch('/:id/number', authenticateToken, (req, res) => {
    const controller = new ResourcesController(req, res);
    controller.updateNumber();
});

// Изменить имя
router.patch('/:id/name', authenticateToken, (req, res) => {
    const controller = new ResourcesController(req, res);
    controller.updateName();
});

// Изменить изображение
router.patch('/:id/image', authenticateToken, resourceMediaUpload, (req, res) => {
    const controller = new ResourcesController(req, res);
    controller.updateImage();
});

// Изменить необходимое количество энерегии
router.patch('/:id/needEnergy', authenticateToken, (req, res) => {
    const controller = new ResourcesController(req, res);
    controller.updateNeedEnergy();
});

// Изменить необходимое количество денег
router.patch('/:id/needMoney', authenticateToken, (req, res) => {
    const controller = new ResourcesController(req, res);
    controller.updateNeedMoney();
});

// Добыча ресурса фермой
router.post('/:id/extract/farm', authenticateToken, (req, res) => {
    const controller = new ResourcesController(req, res);
    controller.orgExtract();
});

// Покупка ресурса организацией у организации
router.post('/:id/buy-org-from-org', authenticateToken, (req, res) => {
    const controller = new ResourcesController(req, res);
    controller.buyOrgFromOrg();
});

// Покупка ресурса пользователем у организации
router.post('/:id/buy-user-from-org', authenticateToken, (req, res) => {
    const controller = new ResourcesController(req, res);
    controller.buyUserFromOrg();
});

export default router;