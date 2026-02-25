import express from 'express';
import { requireAdmin } from '../middleware/admin.js';
import { db } from '../database/init.js';

const router = express.Router();

// Get all users (admin only)
router.get('/users', requireAdmin, (req, res) => {
  try {
    const users = db.prepare(`
      SELECT 
        id, username, email, firstName, lastName, role, isBanned, createdAt,
        (SELECT COUNT(*) FROM posts WHERE authorId = users.id) as postsCount
      FROM users
      ORDER BY createdAt DESC
    `).all();

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Ban/Unban user
router.post('/users/:id/ban', requireAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { isBanned } = req.body;

    if (userId === req.user.userId) {
      return res.status(400).json({ error: 'Cannot ban yourself' });
    }

    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot ban admin user' });
    }

    db.prepare('UPDATE users SET isBanned = ? WHERE id = ?').run(isBanned ? 1 : 0, userId);

    res.json({ message: isBanned ? 'User banned' : 'User unbanned' });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete post (admin only)
router.delete('/posts/:id', requireAdmin, (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    db.prepare('DELETE FROM posts WHERE id = ?').run(postId);

    res.json({ message: 'Post deleted by admin' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete comment (admin only)
router.delete('/comments/:id', requireAdmin, (req, res) => {
  try {
    const commentId = parseInt(req.params.id);

    const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    db.prepare('DELETE FROM comments WHERE id = ?').run(commentId);

    res.json({ message: 'Comment deleted by admin' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all posts for moderation
router.get('/posts', requireAdmin, (req, res) => {
  try {
    const posts = db.prepare(`
      SELECT 
        p.*,
        u.username as authorUsername,
        u.avatar as authorAvatar,
        u.firstName as authorFirstName,
        u.lastName as authorLastName,
        o.name as organizationName,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likesCount,
        (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentsCount
      FROM posts p
      LEFT JOIN users u ON p.authorId = u.id
      LEFT JOIN organizations o ON p.organizationId = o.id
      ORDER BY p.createdAt DESC
      LIMIT 100
    `).all();

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

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get statistics
router.get('/stats', requireAdmin, (req, res) => {
  try {
    const stats = {
      totalUsers: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
      totalPosts: db.prepare('SELECT COUNT(*) as count FROM posts').get().count,
      totalComments: db.prepare('SELECT COUNT(*) as count FROM comments').get().count,
      totalOrganizations: db.prepare('SELECT COUNT(*) as count FROM organizations').get().count,
      bannedUsers: db.prepare('SELECT COUNT(*) as count FROM users WHERE isBanned = 1').get().count,
      adminUsers: db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('admin').count,
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Make user admin
router.post('/users/:id/make-admin', requireAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.prepare('UPDATE users SET role = ? WHERE id = ?').run('admin', userId);

    res.json({ message: 'User promoted to admin' });
  } catch (error) {
    console.error('Make admin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove admin role
router.post('/users/:id/remove-admin', requireAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (userId === req.user.userId) {
      return res.status(400).json({ error: 'Cannot remove your own admin role' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.prepare('UPDATE users SET role = ? WHERE id = ?').run('user', userId);

    res.json({ message: 'Admin role removed' });
  } catch (error) {
    console.error('Remove admin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;



