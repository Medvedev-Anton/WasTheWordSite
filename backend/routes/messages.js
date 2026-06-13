import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../database/init.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import MessagesParamsController from '../controllers/messages_params_controller.js';
import MessagesParamsFacade from '../facades/messages_params_facade.js';
import ChatsFacade from '../facades/chats_facade.js';
import ChatsController from '../controllers/chats_controller.js';

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

    const lastReadedMessageSendedByUser = ChatsFacade.getLastReadedMessageSendedByUser(userId, chatId);
    const lastReadedMessageReceivedByUser = ChatsFacade.getLastReadedMessageReceivedByUser(userId, chatId);

    const messages = db.prepare(`
      SELECT 
        m.*,
        u.username,
        u.avatar,
        u.firstName,
        u.lastName,
        CASE
          WHEN m.userId = ? THEN
            CASE 
              WHEN m.id <= ? THEN
                1
              ELSE
                0
            END
          ELSE
            CASE 
              WHEN m.id <= ? THEN
                1
              ELSE
                0
            END
        END as isReaded,
      r.thumbnail_url as rangImageUrl

      FROM messages m
      JOIN users u ON m.userId = u.id
      JOIN rangs r ON u.rangId = r.id
      WHERE m.chatId = ?
      ORDER BY m.createdAt ASC
    `).all(userId, lastReadedMessageSendedByUser, lastReadedMessageReceivedByUser, chatId);

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

    const messageLiveDuring = parseInt(MessagesParamsFacade.getByName('liveDuringDays'));
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + messageLiveDuring);

    const result = db.prepare(`
      INSERT INTO messages (chatId, userId, content, fileUrl, fileName, fileType, expiredAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(chatId, userId, content || '', fileUrl, fileName, fileType, expiredAt.toISOString());

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

// Send message as response to another message
router.post('/response', authenticateToken, upload.single('file'), (req, res) => {
  try {
    const { chatId, content, responseMessageText, responseMessageAuthor, responseMessageId } = req.body;
    const userId = req.user.userId;

    if (!chatId) {
      return res.status(400).json({ error: 'Chat ID is required' });
    }

    if (!content && !req.file) {
      return res.status(400).json({ error: 'Content or file is required' });
    }

    if (!responseMessageText || !responseMessageAuthor || !responseMessageId) {
      return res.status(400).json({ error: 'Response message params is required' });
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

    const messageLiveDuring = parseInt(MessagesParamsFacade.getByName('liveDuringDays'));
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + messageLiveDuring);

    const result = db.prepare(`
      INSERT INTO messages (
        chatId, 
        userId, 
        content, 
        fileUrl, 
        fileName, 
        fileType, 
        expiredAt, 
        responseFromMessageText, 
        responseFromMessageAuthor,
        responseFromMessageId,
        isResponse
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      chatId, 
      userId, 
      content || '', 
      fileUrl, 
      fileName, 
      fileType, 
      expiredAt.toISOString(), 
      responseMessageText, 
      responseMessageAuthor,
      responseMessageId
    );

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

    ChatsFacade.deleteMessageById(messageId);

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

router.post('/:id/read', authenticateToken, (req, res) => {
  const controller = new ChatsController(req, res);
  controller.updateLastReadedMessageInChat();
})

// Get message live during days
router.get('/live-during', authenticateToken, (req, res) => {
  const controller = new MessagesParamsController(req, res);
  controller.getMessageLiveDuring();
});

// Update message live during days
router.post('/live-during', authenticateToken, (req, res) => {
  const controller = new MessagesParamsController(req, res);
  controller.updateMessageLiveDuring();
});


export default router;



