import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import CompoundItemsController from '../controllers/compound_items_controller.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads', 'compound-items');
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

// Получить все предметы
router.get('/', authenticateToken, (req, res) => {
    const controller = new CompoundItemsController(req, res);
    controller.getAll();
});

// Создать предмет
router.post('/', authenticateToken, resourceMediaUpload, (req, res) => {
    const controller = new CompoundItemsController(req, res);
    controller.create();
}); 

// Удалить предмет
router.delete('/:id', authenticateToken, (req, res) => {
    const controller = new CompoundItemsController(req, res);
    controller.delete();
});

// Изменить номер
router.patch('/:id/number', authenticateToken, (req, res) => {
    const controller = new CompoundItemsController(req, res);
    controller.updateNumber();
});

// Изменить имя
router.patch('/:id/name', authenticateToken, (req, res) => {
    const controller = new CompoundItemsController(req, res);
    controller.updateName();
});

// Изменить изображение
router.patch('/:id/image', authenticateToken, resourceMediaUpload, (req, res) => {
    const controller = new CompoundItemsController(req, res);
    controller.updateImage();
});

// Создать часть предмета
router.post('/:id/parts', authenticateToken, (req, res) => {
  const controller = new CompoundItemsController(req, res);
    controller.createPart();
});

// Удалить часть предмета
router.post('/:id/parts/:partId', authenticateToken, (req, res) => {
  const controller = new CompoundItemsController(req, res);
    controller.deletePart();
});

export default router;