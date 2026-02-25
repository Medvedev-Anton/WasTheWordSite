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
const uploadsDir = path.join(__dirname, '..', 'uploads');
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

// Get all users (for chat creation)
router.get('/', authenticateToken, (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const users = db.prepare(`
      SELECT 
        id, username, email, firstName, lastName, avatar, allowMessagesFrom
      FROM users
      WHERE id != ? AND isBanned = 0
      ORDER BY username ASC
    `).all(currentUserId);

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = db.prepare('SELECT id, username, email, firstName, lastName, age, work, about, avatar, role, isBanned, allowMessagesFrom FROM users WHERE id = ?').get(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user photos
    const photos = db.prepare('SELECT id, photoUrl, createdAt FROM user_photos WHERE userId = ? ORDER BY createdAt DESC').all(userId);

    // Get user posts (wall)
    const posts = db.prepare(`
      SELECT 
        p.*,
        u.username as authorUsername,
        u.avatar as authorAvatar,
        u.firstName as authorFirstName,
        u.lastName as authorLastName,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likesCount,
        (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentsCount,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id AND userId = ?) as isLiked,
        (SELECT COUNT(*) FROM posts WHERE repostOfId = p.id) as repostsCount
      FROM posts p
      LEFT JOIN users u ON p.authorId = u.id
      WHERE p.authorId = ? AND p.organizationId IS NULL
      ORDER BY p.createdAt DESC
    `).all(req.user.userId, userId);

    // Get files for all posts
    if (posts.length > 0) {
      const postIds = posts.map(p => p.id);
      const placeholders = postIds.map(() => '?').join(',');
      const files = db.prepare(`
        SELECT id, postId, fileUrl, fileName, fileType
        FROM post_files
        WHERE postId IN (${placeholders})
        ORDER BY postId, id ASC
      `).all(...postIds);
      
      const filesByPostId = {};
      files.forEach(file => {
        if (!filesByPostId[file.postId]) {
          filesByPostId[file.postId] = [];
        }
        filesByPostId[file.postId].push({
          id: file.id,
          fileUrl: file.fileUrl,
          fileName: file.fileName,
          fileType: file.fileType
        });
      });
      
      posts.forEach(post => {
        post.files = filesByPostId[post.id] || [];
      });
    }

    res.json({ ...user, photos, posts });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const currentUserId = req.user.userId;

    if (userId !== currentUserId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { firstName, lastName, age, work, about, allowMessagesFrom } = req.body;

    db.prepare(`
      UPDATE users 
      SET firstName = ?, lastName = ?, age = ?, work = ?, about = ?, allowMessagesFrom = ?
      WHERE id = ?
    `).run(firstName || null, lastName || null, age || null, work || null, about || null, allowMessagesFrom || 'everyone', userId);

    const user = db.prepare('SELECT id, username, email, firstName, lastName, age, work, about, avatar, role, isBanned, allowMessagesFrom FROM users WHERE id = ?').get(userId);

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload avatar
router.post('/:id/avatar', authenticateToken, upload.single('avatar'), (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const currentUserId = req.user.userId;

    if (userId !== currentUserId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatarUrl, userId);

    res.json({ avatar: avatarUrl });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload photo
router.post('/:id/photos', authenticateToken, upload.single('photo'), (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const currentUserId = req.user.userId;

    if (userId !== currentUserId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    const result = db.prepare('INSERT INTO user_photos (userId, photoUrl) VALUES (?, ?)').run(userId, photoUrl);

    const photo = db.prepare('SELECT * FROM user_photos WHERE id = ?').get(result.lastInsertRowid);
    res.json(photo);
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete photo
router.delete('/:id/photos/:photoId', authenticateToken, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const photoId = parseInt(req.params.photoId);
    const currentUserId = req.user.userId;

    if (userId !== currentUserId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    db.prepare('DELETE FROM user_photos WHERE id = ? AND userId = ?').run(photoId, userId);
    res.json({ message: 'Photo deleted' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
