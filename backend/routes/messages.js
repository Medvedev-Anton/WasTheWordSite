import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../database/init.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads', 'messages');
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

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Get messages for a chat
router.get('/chat/:chatId', authenticateToken, (req, res) => {
  try {
    const chatId = parseInt(req.params.chatId);
    const userId = req.user.userId;

    // Check if user is participant
    const participant = db.prepare('SELECT * FROM chat_participants WHERE chatId = ? AND userId = ?').get(chatId, userId);
    if (!participant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = db.prepare(`
      SELECT 
        m.*,
        u.username,
        u.avatar,
        u.firstName,
        u.lastName
      FROM messages m
      JOIN users u ON m.userId = u.id
      WHERE m.chatId = ?
      ORDER BY m.createdAt ASC
    `).all(chatId);

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send message
router.post('/', authenticateToken, upload.single('file'), (req, res) => {
  try {
    const { chatId, content } = req.body;
    const userId = req.user.userId;

    if (!chatId) {
      return res.status(400).json({ error: 'Chat ID is required' });
    }

    if (!content && !req.file) {
      return res.status(400).json({ error: 'Content or file is required' });
    }

    // Check if user is participant
    const participant = db.prepare('SELECT * FROM chat_participants WHERE chatId = ? AND userId = ?').get(chatId, userId);
    if (!participant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const fileUrl = req.file ? `/uploads/messages/${req.file.filename}` : null;
    // Properly decode filename to handle Cyrillic characters
    let fileName = null;
    if (req.file) {
      try {
        // Try multiple decoding strategies for Cyrillic characters
        let decoded = req.file.originalname;
        
        // First, try URL decoding
        try {
          decoded = decodeURIComponent(decoded);
        } catch (e) {
          // If URL decoding fails, try Buffer conversion
          try {
            // If the name appears to be in wrong encoding (like ISO-8859-1), convert from Buffer
            const buffer = Buffer.from(decoded, 'latin1');
            decoded = buffer.toString('utf8');
          } catch (e2) {
            // If all fails, use original
            decoded = req.file.originalname;
          }
        }
        
        fileName = decoded;
      } catch (e) {
        // If all decoding fails, use original name
        fileName = req.file.originalname;
      }
    }
    const fileType = req.file ? req.file.mimetype : null;

    const result = db.prepare(`
      INSERT INTO messages (chatId, userId, content, fileUrl, fileName, fileType)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(chatId, userId, content || '', fileUrl, fileName, fileType);

    const message = db.prepare(`
      SELECT 
        m.*,
        u.username,
        u.avatar,
        u.firstName,
        u.lastName
      FROM messages m
      JOIN users u ON m.userId = u.id
      WHERE m.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete message (soft delete)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const messageId = parseInt(req.params.id);
    const userId = req.user.userId;

    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Delete the file from disk if exists
    if (message.fileUrl && !message.fileDeleted) {
      const filePath = path.join(__dirname, '..', message.fileUrl.replace(/^\//, ''));
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }
    }

    const now = new Date().toISOString();
    db.prepare(
      `UPDATE messages SET isDeleted = 1, deletedAt = ?, content = '', fileUrl = NULL, fileName = NULL, fileType = NULL, fileDeleted = 1, fileDeletedAt = ? WHERE id = ?`
    ).run(now, message.fileUrl ? now : null, messageId);

    const updated = db.prepare(`
      SELECT m.*, u.username, u.avatar, u.firstName, u.lastName
      FROM messages m JOIN users u ON m.userId = u.id WHERE m.id = ?
    `).get(messageId);

    res.json(updated);
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;



