import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../database/init.js';

const router = express.Router();

// Get all chats for current user
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    const chats = db.prepare(`
      SELECT DISTINCT
        c.*,
        (SELECT content FROM messages WHERE chatId = c.id ORDER BY createdAt DESC LIMIT 1) as lastMessage,
        (SELECT createdAt FROM messages WHERE chatId = c.id ORDER BY createdAt DESC LIMIT 1) as lastMessageTime
      FROM chats c
      JOIN chat_participants cp ON c.id = cp.chatId
      WHERE cp.userId = ?
      ORDER BY lastMessageTime DESC
    `).all(userId);

    // For personal chats, get the other participant's info
    const chatsWithParticipants = chats.map(chat => {
      if (chat.type === 'personal') {
        const otherParticipant = db.prepare(`
          SELECT u.id, u.username, u.avatar, u.firstName, u.lastName
          FROM chat_participants cp
          JOIN users u ON cp.userId = u.id
          WHERE cp.chatId = ? AND cp.userId != ?
        `).get(chat.id, userId);

        return { ...chat, otherParticipant };
      }
      return chat;
    });

    res.json(chatsWithParticipants);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get chat by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const chatId = parseInt(req.params.id);
    const userId = req.user.userId;

    // Check if user is participant
    const participant = db.prepare('SELECT * FROM chat_participants WHERE chatId = ? AND userId = ?').get(chatId, userId);
    if (!participant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);

    // Get participants
    const participants = db.prepare(`
      SELECT 
        cp.*,
        u.username,
        u.avatar,
        u.firstName,
        u.lastName
      FROM chat_participants cp
      JOIN users u ON cp.userId = u.id
      WHERE cp.chatId = ?
    `).all(chatId);

    res.json({ ...chat, participants });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create personal chat
router.post('/personal', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ error: 'Target user ID is required' });
    }

    // Check if target user allows messages
    const targetUser = db.prepare('SELECT allowMessagesFrom FROM users WHERE id = ? AND isBanned = 0').get(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found or banned' });
    }

    if (targetUser.allowMessagesFrom === 'nobody') {
      return res.status(403).json({ error: 'This user does not accept messages' });
    }

    // Check if personal chat already exists
    const existingChat = db.prepare(`
      SELECT c.id
      FROM chats c
      WHERE c.type = 'personal'
      AND EXISTS (SELECT 1 FROM chat_participants WHERE chatId = c.id AND userId = ?)
      AND EXISTS (SELECT 1 FROM chat_participants WHERE chatId = c.id AND userId = ?)
    `).get(userId, targetUserId);

    if (existingChat) {
      return res.json({ chatId: existingChat.id, message: 'Chat already exists' });
    }

    // Create new chat
    const result = db.prepare("INSERT INTO chats (type) VALUES ('personal')").run();
    const chatId = result.lastInsertRowid;

    // Add participants
    db.prepare('INSERT INTO chat_participants (chatId, userId) VALUES (?, ?)').run(chatId, userId);
    db.prepare('INSERT INTO chat_participants (chatId, userId) VALUES (?, ?)').run(chatId, targetUserId);

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
    res.status(201).json(chat);
  } catch (error) {
    console.error('Create personal chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create group chat
router.post('/group', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, participantIds } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return res.status(400).json({ error: 'At least one participant is required' });
    }

    // Create new chat
    const result = db.prepare("INSERT INTO chats (name, type) VALUES (?, 'group')").run(name);
    const chatId = result.lastInsertRowid;

    // Add creator as participant
    db.prepare('INSERT INTO chat_participants (chatId, userId) VALUES (?, ?)').run(chatId, userId);

    // Add other participants
    participantIds.forEach(participantId => {
      if (participantId !== userId) {
        db.prepare('INSERT INTO chat_participants (chatId, userId) VALUES (?, ?)').run(chatId, participantId);
      }
    });

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
    res.status(201).json(chat);
  } catch (error) {
    console.error('Create group chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add participant to group chat
router.post('/:id/participants', authenticateToken, (req, res) => {
  try {
    const chatId = parseInt(req.params.id);
    const userId = req.user.userId;
    const { participantId } = req.body;

    const chat = db.prepare('SELECT * FROM chats WHERE id = ?').get(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (chat.type !== 'group') {
      return res.status(400).json({ error: 'Can only add participants to group chats' });
    }

    // Check if user is participant
    const isParticipant = db.prepare('SELECT * FROM chat_participants WHERE chatId = ? AND userId = ?').get(chatId, userId);
    if (!isParticipant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if target user is already participant
    const existing = db.prepare('SELECT * FROM chat_participants WHERE chatId = ? AND userId = ?').get(chatId, participantId);
    if (existing) {
      return res.status(400).json({ error: 'User is already a participant' });
    }

    db.prepare('INSERT INTO chat_participants (chatId, userId) VALUES (?, ?)').run(chatId, participantId);
    res.json({ message: 'Participant added' });
  } catch (error) {
    console.error('Add participant error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

