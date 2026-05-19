import express from 'express';
import { requireAdmin } from '../middleware/admin.js';
import { db } from '../database/init.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { error } from 'console';

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

const heroesUploadsDir = path.join(__dirname, '..', 'uploads', 'heroes');
if (!fs.existsSync(heroesUploadsDir)) {
  fs.mkdirSync(heroesUploadsDir, { recursive: true });
}

const heroStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, heroesUploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'hero-' + uniqueSuffix + extension);
  }
});

const uploadHero = multer({
  storage: heroStorage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Get all users (admin only)
router.get('/users', requireAdmin, (req, res) => {
  try {
    const users = db.prepare(`
      SELECT 
        id, username, email, firstName, lastName, role, isBanned, canCreateGovernmentOrganizations, createdAt,
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

router.post('/users/:id/government-org-access', requireAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { canCreateGovernmentOrganizations } = req.body;

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.prepare('UPDATE users SET canCreateGovernmentOrganizations = ? WHERE id = ?')
      .run(canCreateGovernmentOrganizations ? 1 : 0, userId);

    res.json({ message: 'Government organization creation permission updated' });
  } catch (error) {
    console.error('Update government organization access error:', error);
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
      'Правительственная', 'Банковская', 'Волонтёрская', 'Спортивная', 'Свободная'];
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
      'Правительственная', 'Банковская', 'Волонтёрская', 'Спортивная', 'Свободная'];
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

router.get('/heroes/:id/states', requireAdmin, (req, res) => {
  try {
    const heroId = req.params.id;

    const states = db.prepare(`
      SELECT hs.*, r.name as rangName, r.orderNumber as rangLevel
      FROM hero_states hs
      LEFT JOIN rangs r ON hs.minRangId = r.id
      WHERE hs.heroId = ?
      ORDER BY r.orderNumber ASC
    `).all(heroId);

    res.json(states);
  } catch (error) {
    console.error('Error get states:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /admin/heroes/:id/states
router.post('/heroes/:id/states', requireAdmin, uploadHero.single('image'), (req, res) => {
  try {
    const heroId = req.params.id;
    const { rangId } = req.body;

    if (!rangId) {
      return res.status(400).json({ error: 'rangId is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const imagePath = `/uploads/heroes/${req.file.filename}`;

    const result = db.prepare(`
      INSERT INTO hero_states (heroId, minRangId, imagePath) 
      VALUES (?, ?, ?)
    `).run(heroId, rangId, imagePath);

    const newState = db.prepare(`
      SELECT hs.*, r.name as rangName 
      FROM hero_states hs
      LEFT JOIN rangs r ON hs.minRangId = r.id
      WHERE hs.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      message: 'State created',
      state: newState
    });
  } catch (error) {
    console.error('Create state error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /admin/heroes/states/:stateId
router.put('/heroes/states/:stateId', requireAdmin, uploadHero.single('image'), (req, res) => {
  try {
    const stateId = req.params.stateId;
    const { minRangId } = req.body;

    const existing = db.prepare('SELECT * FROM hero_states WHERE id = ?').get(stateId);
    if (!existing) {
      return res.status(404).json({ error: 'State not found' });
    }

    let imagePath = existing.imagePath;
    if (req.file) {
      try {
        const oldFilePath = path.join(heroesUploadsDir, existing.imagePath.split('/').pop());
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (fileErr) {
        console.warn('Could not delete old image:', fileErr);
      }
      imagePath = `/uploads/heroes/${req.file.filename}`;
    }

    db.prepare(`
      UPDATE hero_states 
      SET minRangId = COALESCE(?, minRangId),
          imagePath = COALESCE(?, imagePath)
      WHERE id = ?
    `).run(minRangId || null, imagePath, stateId);

    const updatedState = db.prepare(`
      SELECT hs.*, r.name as rangName 
      FROM hero_states hs
      LEFT JOIN rangs r ON hs.minRangId = r.id
      WHERE hs.id = ?
    `).get(stateId);

    res.json({
      message: 'State updated',
      state: updatedState
    });
  } catch (error) {
    console.error('Update state error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /admin/heroes/states/:stateId
router.delete('/heroes/states/:stateId', requireAdmin, (req, res) => {
  try {
    const stateId = req.params.stateId;

    const existing = db.prepare('SELECT imagePath FROM hero_states WHERE id = ?').get(stateId);
    if (existing && existing.imagePath) {
      try {
        const fileName = existing.imagePath.split('/').pop();
        const filePath = path.join(heroesUploadsDir, fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileErr) {
        console.warn('Could not delete image:', fileErr);
      }
    }

    db.prepare('DELETE FROM hero_states WHERE id = ?').run(stateId);

    res.json({ message: 'State deleted', stateId: parseInt(stateId) });
  } catch (error) {
    console.error('Delete state error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /admin/heroes
router.get('/heroes', requireAdmin, (req, res) => {
  try {
    const heroes = db.prepare(`
      SELECT 
        heroes.*,
        COALESCE(
          '[' || GROUP_CONCAT(
            CASE WHEN hs.id IS NOT NULL THEN
              json_object(
                'id', hs.id,
                'minRangId', hs.minRangId,
                'imagePath', hs.imagePath,
                'heroId', hs.heroId
              )
            ELSE
              NULL
            END
          ) || ']',
          '[]'
        ) as states
      FROM heroes
      LEFT JOIN hero_states hs ON heroes.id = hs.heroId
      GROUP BY heroes.id;
    `).all();

    const parsedHeroes = heroes.map(hero => ({
      id: hero.id,
      name: hero.name,
      gender: hero.gender,
      defaultImagePath: hero.defaultImagePath,
      states: JSON.parse(hero.states)
    }));
    res.json({ heroes: parsedHeroes });
  }
  catch (error) {
    console.error('Error fetching heroes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /admin/heroes
router.post('/heroes', requireAdmin, uploadHero.single('defaultImage'), (req, res) => {
  try {
    const { name, gender } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Hero name' });
    }

    if (!gender || (gender != 'M' && gender != 'F')) {
      return res.status(400).json({ error: 'Invalid gender' });
    }

    const existing = db.prepare('SELECT id FROM heroes WHERE name = ?').get(name);
    if (existing) {
      return res.status(400).json({ error: 'This Hero already exists with name' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'It is necessary to indicate the image of the hero' });
    }

    let defaultImagePath = `/uploads/heroes/${req.file.filename}`;

    const result = db.prepare(`
      INSERT INTO heroes (name, defaultImagePath, gender) 
      VALUES (?, ?, ?)
    `).run(name, defaultImagePath, gender);

    const newHero = db.prepare('SELECT * FROM heroes WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ message: "Hero created successfully", hero: newHero });
  } catch (error) {
    console.error('Create hero error:', error);
    res.status(500).json({ error: 'Error server' });
  }
});

// DELETE /admin/heroes/:id
router.delete('/heroes/:id', requireAdmin, (req, res) => {
  try {
    const heroId = req.params.id;
    const existing = db.prepare('SELECT id, defaultImagePath FROM heroes WHERE id = ?').get(heroId);
    if (!existing) {
      return res.status(404).json({ error: 'Hero not found' });
    }

    if (existing.defaultImagePath) {
      try {
        const filePath = path.join(__dirname, '..', existing.defaultImagePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileErr) {
        console.warn('Could not delete hero image:', fileErr);
      }
    }

    const result = db.prepare('DELETE FROM heroes WHERE id = ?').run(heroId);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Hero not found' });
    }

    db.prepare('UPDATE users SET heroId = NULL WHERE heroId = ?').run(heroId);

    res.json({
      message: 'Hero deleted',
      deletedId: parseInt(heroId)
    });
  } catch (error) {
    console.error('Delete hero error:', error);
    res.status(500).json({ error: 'Error server' });
  }
});

// PUT /admin/heroes/:id
router.put('/heroes/:id', requireAdmin, uploadHero.single('defaultImage'), (req, res) => {
  try {
    const heroId = req.params.id;
    const { name } = req.body;

    const existing = db.prepare('SELECT * FROM heroes WHERE id = ?').get(heroId);
    if (!existing) {
      return res.status(404).json({ error: 'Hero not found' });
    }

    if (name && name !== existing.name) {
      const nameExists = db.prepare('SELECT id FROM heroes WHERE name = ? AND id != ?').get(name, heroId);
      if (nameExists) {
        return res.status(400).json({ error: 'Hero already exists' });
      }
    }

    let defaultImagePath = existing.defaultImagePath;

    if (req.file) {
      if (existing.defaultImagePath) {
        try {
          const oldFilePath = path.join(__dirname, '..', existing.defaultImagePath);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        } catch (fileErr) {
          console.warn('Could not delete old image:', fileErr);
        }
      }
      defaultImagePath = `/uploads/heroes/${req.file.filename}`;
    }

    db.prepare(`
      UPDATE heroes 
      SET name = COALESCE(?, name),
          defaultImagePath = COALESCE(?, defaultImagePath)
      WHERE id = ?
    `).run(name || null, defaultImagePath, heroId);

    const updatedHero = db.prepare('SELECT * FROM heroes WHERE id = ?').get(heroId);

    res.json({
      message: 'Hero updated',
      hero: updatedHero
    });
  } catch (error) {
    console.error('Update hero error:', error);
    res.status(500).json({ error: 'Error server' });
  }
});

export default router;



