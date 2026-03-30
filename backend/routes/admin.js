import express from 'express';
import { requireAdmin } from '../middleware/admin.js';
import { db } from '../database/init.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads', 'organizations');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

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

router.get('/icons', requireAdmin, (req, res) => {
  try {
    const icons = db.prepare('SELECT * FROM organization_icon').all();
    res.status(200).json({ icons: icons });
  }
  catch (error) {
    console.error('get organization-images:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/icons', requireAdmin, upload.array('images', 30), (req, res) => {
  try {
    const { orgType } = req.body;
    if (!orgType) {
      return res.status(400).json({ error: 'orgType is required' });
    }

    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'At least one image file is required' });
    }

    const validTypes = ['Производственная', 'Коммерческая', 'Административная', 'Образовательная',
      'Волонтёрская', 'Спортивная', 'Свободная'];
    if (!validTypes.includes(orgType)) {
      return res.status(400).json({ error: 'Invalid organization type' });
    }

    const inserted = [];
    for (const file of files) {
      const imageUrl = `/uploads/organizations/${file.filename}`;
      const result = db.prepare('INSERT INTO organization_icon (orgType, imageUrl) VALUES (?, ?)').run(orgType, imageUrl);
      inserted.push(db.prepare('SELECT * FROM organization_icon WHERE id = ?').get(result.lastInsertRowid));
    }

    res.status(201).json(inserted.length === 1 ? inserted[0] : inserted);

  } catch (error) {
    console.error('Error creating organization icon:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/icons/:id', requireAdmin, upload.single('image'), (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const existingIcon = db.prepare('SELECT * FROM organization_icon WHERE id = ?').get(id);
    if (!existingIcon) {
      return res.status(404).json({ error: 'Icon not found' });
    }

    const oldImageUrl = existingIcon.imageUrl;
    const newImageUrl = `/uploads/organizations/${req.file.filename}`;

    db.prepare(`
      UPDATE organization_icon 
      SET imageUrl = ?
      WHERE id = ?
    `).run(newImageUrl, id);

    try {
      const oldFilePath = path.join(uploadsDir, oldImageUrl.replace('/uploads/organizations', ''));
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    } catch (fileErr) {
      console.warn('Could not delete old file:', fileErr);
    }

    const updatedIcon = db.prepare('SELECT * FROM organization_icon WHERE id = ?').get(id);
    res.json(updatedIcon);

  } catch (error) {
    console.error('Error updating organization icon:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/icons/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;

    const icon = db.prepare('SELECT * FROM organization_icon WHERE id = ?').get(id);
    if (!icon) {
      return res.status(404).json({ error: 'Icon not found' });
    }

    if (icon.orgType === 'DEFAULT') {
      return res.status(400).json({ error: 'Cannot delete default icon' });
    }

    db.prepare(`
      UPDATE organizations 
      SET organization_icon_id = 1 
      WHERE organization_icon_id = ?
    `).run(id);

    try {
      const fileName = icon.imageUrl.split('/').pop();
      if (fileName) {
        const filePath = path.join(uploadsDir, fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log('File deleted:', fileName);
        }
      }
    } catch (fileErr) {
      console.warn('Could not delete file:', fileErr);
    }

    db.prepare('DELETE FROM organization_icon WHERE id = ?').run(id);
    const updatedCount = db.prepare('SELECT changes() as count').get().count;

    res.json({
      message: 'Icon deleted successfully',
      organizationsUpdated: updatedCount
    });

  } catch (error) {
    console.error('Error deleting organization icon:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Preset covers CRUD ───────────────────────────────────────────────────────

// GET /admin/covers
router.get('/covers', requireAdmin, (req, res) => {
  try {
    const covers = db.prepare('SELECT * FROM organization_cover ORDER BY createdAt DESC').all();
    res.json({ covers });
  } catch (error) {
    console.error('Get covers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /admin/covers  (bulk)
// orgType is optional: if provided, this is a type-default cover; if omitted, it's a generic preset.
router.post('/covers', requireAdmin, upload.array('images', 30), (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'At least one image file is required' });
    }

    const { orgType } = req.body;
    const validTypes = ['Производственная', 'Коммерческая', 'Административная', 'Образовательная',
      'Волонтёрская', 'Спортивная', 'Свободная'];
    const resolvedOrgType = (orgType && validTypes.includes(orgType)) ? orgType : null;

    const inserted = [];
    for (const file of files) {
      const imageUrl = `/uploads/organizations/${file.filename}`;
      const result = db.prepare('INSERT INTO organization_cover (imageUrl, orgType) VALUES (?, ?)').run(imageUrl, resolvedOrgType);
      inserted.push(db.prepare('SELECT * FROM organization_cover WHERE id = ?').get(result.lastInsertRowid));
    }

    res.status(201).json({ covers: inserted });
  } catch (error) {
    console.error('Error creating covers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /admin/covers/:id
router.delete('/covers/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;

    const cover = db.prepare('SELECT * FROM organization_cover WHERE id = ?').get(id);
    if (!cover) {
      return res.status(404).json({ error: 'Cover not found' });
    }

    // Reset orgs that used this cover
    db.prepare('UPDATE organizations SET organization_cover_id = NULL WHERE organization_cover_id = ?').run(id);

    // Delete file
    try {
      const fileName = cover.imageUrl.split('/').pop();
      if (fileName) {
        const filePath = path.join(uploadsDir, fileName);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    } catch (fileErr) {
      console.warn('Could not delete cover file:', fileErr);
    }

    db.prepare('DELETE FROM organization_cover WHERE id = ?').run(id);
    res.json({ message: 'Cover deleted successfully' });
  } catch (error) {
    console.error('Error deleting cover:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;



