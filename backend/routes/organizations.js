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

// Org type hierarchy
const ORG_HIERARCHY = {
  'Производственная': 'Цех',
  'Коммерческая': 'Отдел',
  'Образовательная': 'Факультет',
  'Административная': 'Отделение',
  'Цех': 'Мастерская',
  'Отдел': 'Группа',
  'Факультет': 'Кафедра',
  'Отделение': 'Сектор',
};

const ROOT_ORG_TYPES = ['Производственная', 'Коммерческая', 'Образовательная', 'Административная', 'Свободная'];

function getSubOrgType(parentType) {
  return ORG_HIERARCHY[parentType] || null;
}

// Get all organizations (root-level by default, supports ?parentId=)
router.get('/', authenticateToken, (req, res) => {
  try {
    const { parentId } = req.query;
    let organizations;

    if (parentId !== undefined && parentId !== '' && parentId !== 'null') {
      const pid = parseInt(parentId);
      organizations = db.prepare(`
        SELECT 
          o.*,
          u.username as adminUsername,
          (SELECT COUNT(*) FROM organization_members WHERE organizationId = o.id) as membersCount
        FROM organizations o
        JOIN users u ON o.adminId = u.id
        WHERE o.parentId = ?
        ORDER BY o.createdAt DESC
      `).all(pid);
    } else {
      organizations = db.prepare(`
        SELECT 
          o.*,
          u.username as adminUsername,
          (SELECT COUNT(*) FROM organization_members WHERE organizationId = o.id) as membersCount
        FROM organizations o
        JOIN users u ON o.adminId = u.id
        WHERE o.parentId IS NULL
        ORDER BY o.createdAt DESC
      `).all();
    }

    res.json(organizations);
  } catch (error) {
    console.error('Get organizations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get organization by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const orgId = parseInt(req.params.id);
    const organization = db.prepare(`
      SELECT 
        o.*,
        u.username as adminUsername,
        (SELECT COUNT(*) FROM organization_members WHERE organizationId = o.id) as membersCount
      FROM organizations o
      JOIN users u ON o.adminId = u.id
      WHERE o.id = ?
    `).get(orgId);

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Get members
    const members = db.prepare(`
      SELECT 
        om.*,
        u.username,
        u.avatar,
        u.firstName,
        u.lastName
      FROM organization_members om
      JOIN users u ON om.userId = u.id
      WHERE om.organizationId = ?
      ORDER BY om.role DESC, om.createdAt ASC
    `).all(orgId);
    
    // Get sub-organizations
    const subOrganizations = db.prepare(`
      SELECT 
        o.*,
        u.username as adminUsername,
        (SELECT COUNT(*) FROM organization_members WHERE organizationId = o.id) as membersCount
      FROM organizations o
      JOIN users u ON o.adminId = u.id
      WHERE o.parentId = ?
      ORDER BY o.createdAt DESC
    `).all(orgId);

    // Get parent org info if exists
    let parentOrg = null;
    if (organization.parentId) {
      parentOrg = db.prepare('SELECT id, name, orgType FROM organizations WHERE id = ?').get(organization.parentId);
    }

    // Check if current user is admin or moderator
    const currentUserMember = db.prepare('SELECT role FROM organization_members WHERE organizationId = ? AND userId = ?').get(orgId, req.user.userId);
    const canManage = organization.adminId === req.user.userId || currentUserMember?.role === 'admin' || currentUserMember?.role === 'moderator';

    // Get posts
    const posts = db.prepare(`
      SELECT 
        p.*,
        u.username as authorUsername,
        u.avatar as authorAvatar,
        u.firstName as authorFirstName,
        u.lastName as authorLastName,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likesCount,
        (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentsCount,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id AND userId = ?) as isLiked
      FROM posts p
      LEFT JOIN users u ON p.authorId = u.id
      WHERE p.organizationId = ?
      ORDER BY p.createdAt DESC
    `).all(req.user.userId, orgId);

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

    res.json({ ...organization, members, posts, subOrganizations, parentOrg });
  } catch (error) {
    console.error('Get organization error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create organization
router.post('/', authenticateToken, upload.single('avatar'), (req, res) => {
  try {
    const { name, description, defaultCanPost, defaultCanComment, isPrivate, orgType, parentId } = req.body;
    const adminId = req.user.userId;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const avatarUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const canPost = defaultCanPost === 'true' || defaultCanPost === true || defaultCanPost === '1' ? 1 : 0;
    const canComment = defaultCanComment === 'true' || defaultCanComment === true || defaultCanComment === '1' ? 1 : 0;
    const isPrivateFlag = isPrivate === 'true' || isPrivate === true || isPrivate === '1' ? 1 : 0;

    let resolvedType = 'Организация';
    let resolvedParentId = null;

    if (parentId) {
      resolvedParentId = parseInt(parentId);
      const parent = db.prepare('SELECT * FROM organizations WHERE id = ?').get(resolvedParentId);
      if (!parent) {
        return res.status(404).json({ error: 'Parent organization not found' });
      }
      const parentMember = db.prepare('SELECT role FROM organization_members WHERE organizationId = ? AND userId = ?').get(resolvedParentId, adminId);
      if (parent.adminId !== adminId && parentMember?.role !== 'admin' && parentMember?.role !== 'moderator') {
        return res.status(403).json({ error: 'Only admin or moderator can create sub-organizations' });
      }
      const childType = getSubOrgType(parent.orgType);
      if (!childType) {
        return res.status(400).json({ error: `Cannot create sub-organizations inside "${parent.orgType}"` });
      }
      resolvedType = childType;
    } else {
      resolvedType = ROOT_ORG_TYPES.includes(orgType) ? orgType : (orgType || ROOT_ORG_TYPES[0]);
    }

    const result = db.prepare(`
      INSERT INTO organizations (name, description, avatar, adminId, defaultCanPost, defaultCanComment, isPrivate, orgType, parentId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, description || null, avatarUrl, adminId, canPost, canComment, isPrivateFlag, resolvedType, resolvedParentId);

    // Add admin as member with 'admin' role
    db.prepare(`
      INSERT INTO organization_members (organizationId, userId, role, canPost, canComment, isBlocked)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(result.lastInsertRowid, adminId, 'admin', 1, 1, 0);

    const organization = db.prepare(`
      SELECT 
        o.*,
        u.username as adminUsername,
        1 as membersCount
      FROM organizations o
      JOIN users u ON o.adminId = u.id
      WHERE o.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(organization);
  } catch (error) {
    console.error('Create organization error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update organization
router.put('/:id', authenticateToken, upload.single('avatar'), (req, res) => {
  try {
    const orgId = parseInt(req.params.id);
    const userId = req.user.userId;

    const organization = db.prepare('SELECT * FROM organizations WHERE id = ?').get(orgId);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    if (organization.adminId !== userId) {
      return res.status(403).json({ error: 'Only admin can update organization' });
    }

    const { name, description, defaultCanPost, defaultCanComment, isPrivate } = req.body;
    const avatarUrl = req.file ? `/uploads/${req.file.filename}` : organization.avatar;

    const canPost = defaultCanPost !== undefined
      ? (defaultCanPost === 'true' || defaultCanPost === true || defaultCanPost === '1' ? 1 : 0)
      : organization.defaultCanPost;
    const canComment = defaultCanComment !== undefined
      ? (defaultCanComment === 'true' || defaultCanComment === true || defaultCanComment === '1' ? 1 : 0)
      : organization.defaultCanComment;
    const isPrivateFlag = isPrivate !== undefined
      ? (isPrivate === 'true' || isPrivate === true || isPrivate === '1' ? 1 : 0)
      : organization.isPrivate;

    db.prepare(`
      UPDATE organizations 
      SET name = ?, description = ?, avatar = ?, defaultCanPost = ?, defaultCanComment = ?, isPrivate = ?
      WHERE id = ?
    `).run(
      name || organization.name,
      description !== undefined ? description : organization.description,
      avatarUrl,
      canPost,
      canComment,
      isPrivateFlag,
      orgId
    );

    const updated = db.prepare('SELECT * FROM organizations WHERE id = ?').get(orgId);
    res.json(updated);
  } catch (error) {
    console.error('Update organization error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Join organization
router.post('/:id/join', authenticateToken, (req, res) => {
  try {
    const orgId = parseInt(req.params.id);
    const userId = req.user.userId;

    const organization = db.prepare('SELECT * FROM organizations WHERE id = ?').get(orgId);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Check if organization is private
    if (organization.isPrivate === 1) {
      return res.status(403).json({ error: 'This organization is private. You need an invitation to join.' });
    }

    const existing = db.prepare('SELECT * FROM organization_members WHERE organizationId = ? AND userId = ?').get(orgId, userId);
    if (existing) {
      return res.status(400).json({ error: 'Already a member' });
    }

    // Use default permissions from organization (use null-check, not ||, to preserve 0 values)
    const memberCanPost = organization.defaultCanPost != null ? organization.defaultCanPost : 1;
    const memberCanComment = organization.defaultCanComment != null ? organization.defaultCanComment : 1;

    db.prepare(`
      INSERT INTO organization_members (organizationId, userId, role, canPost, canComment, isBlocked)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(orgId, userId, 'member', memberCanPost, memberCanComment, 0);

    res.json({ message: 'Joined organization' });
  } catch (error) {
    console.error('Join organization error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Leave organization
router.post('/:id/leave', authenticateToken, (req, res) => {
  try {
    const orgId = parseInt(req.params.id);
    const userId = req.user.userId;

    const member = db.prepare('SELECT * FROM organization_members WHERE organizationId = ? AND userId = ?').get(orgId, userId);
    if (!member) {
      return res.status(400).json({ error: 'Not a member' });
    }

    if (member.role === 'admin') {
      return res.status(400).json({ error: 'Admin cannot leave organization' });
    }

    db.prepare('DELETE FROM organization_members WHERE organizationId = ? AND userId = ?').run(orgId, userId);
    res.json({ message: 'Left organization' });
  } catch (error) {
    console.error('Leave organization error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Invite user by username (admin/moderator only)
router.post('/:id/invite', authenticateToken, (req, res) => {
  try {
    const orgId = parseInt(req.params.id);
    const adminUserId = req.user.userId;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const organization = db.prepare('SELECT * FROM organizations WHERE id = ?').get(orgId);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const adminMember = db.prepare('SELECT role FROM organization_members WHERE organizationId = ? AND userId = ?').get(orgId, adminUserId);
    if (organization.adminId !== adminUserId && adminMember?.role !== 'admin' && adminMember?.role !== 'moderator') {
      return res.status(403).json({ error: 'Only admin or moderator can invite members' });
    }

    const targetUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existing = db.prepare('SELECT * FROM organization_members WHERE organizationId = ? AND userId = ?').get(orgId, targetUser.id);
    if (existing) {
      return res.status(400).json({ error: 'User is already a member' });
    }

    const invCanPost = organization.defaultCanPost != null ? organization.defaultCanPost : 1;
    const invCanComment = organization.defaultCanComment != null ? organization.defaultCanComment : 1;

    db.prepare(`
      INSERT INTO organization_members (organizationId, userId, role, canPost, canComment, isBlocked)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(orgId, targetUser.id, 'member', invCanPost, invCanComment, 0);

    res.json({ message: 'User invited successfully' });
  } catch (error) {
    console.error('Invite member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Kick member from organization (admin/moderator only)
router.delete('/:id/members/:targetUserId', authenticateToken, (req, res) => {
  try {
    const orgId = parseInt(req.params.id);
    const adminUserId = req.user.userId;
    const targetUserId = parseInt(req.params.targetUserId);

    const organization = db.prepare('SELECT * FROM organizations WHERE id = ?').get(orgId);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const callerMember = db.prepare('SELECT role FROM organization_members WHERE organizationId = ? AND userId = ?').get(orgId, adminUserId);
    if (organization.adminId !== adminUserId && callerMember?.role !== 'admin' && callerMember?.role !== 'moderator') {
      return res.status(403).json({ error: 'Only admin or moderator can kick members' });
    }

    const targetMember = db.prepare('SELECT * FROM organization_members WHERE organizationId = ? AND userId = ?').get(orgId, targetUserId);
    if (!targetMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (targetMember.role === 'admin') {
      return res.status(400).json({ error: 'Cannot kick the admin' });
    }

    db.prepare('DELETE FROM organization_members WHERE organizationId = ? AND userId = ?').run(orgId, targetUserId);
    res.json({ message: 'Member removed' });
  } catch (error) {
    console.error('Kick member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add moderator
router.post('/:id/moderators', authenticateToken, (req, res) => {
  try {
    const orgId = parseInt(req.params.id);
    const userId = req.user.userId;
    const { targetUserId } = req.body;

    const organization = db.prepare('SELECT * FROM organizations WHERE id = ?').get(orgId);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    if (organization.adminId !== userId) {
      return res.status(403).json({ error: 'Only admin can add moderators' });
    }

    const member = db.prepare('SELECT * FROM organization_members WHERE organizationId = ? AND userId = ?').get(orgId, targetUserId);
    if (!member) {
      return res.status(404).json({ error: 'User is not a member' });
    }

    db.prepare('UPDATE organization_members SET role = ? WHERE organizationId = ? AND userId = ?').run('moderator', orgId, targetUserId);

    res.json({ message: 'Moderator added' });
  } catch (error) {
    console.error('Add moderator error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove moderator
router.delete('/:id/moderators/:targetUserId', authenticateToken, (req, res) => {
  try {
    const orgId = parseInt(req.params.id);
    const userId = req.user.userId;
    const targetUserId = parseInt(req.params.targetUserId);

    const organization = db.prepare('SELECT * FROM organizations WHERE id = ?').get(orgId);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    if (organization.adminId !== userId) {
      return res.status(403).json({ error: 'Only admin can remove moderators' });
    }

    db.prepare('UPDATE organization_members SET role = ? WHERE organizationId = ? AND userId = ?').run('member', orgId, targetUserId);

    res.json({ message: 'Moderator removed' });
  } catch (error) {
    console.error('Remove moderator error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update member permissions
router.put('/:id/members/:targetUserId/permissions', authenticateToken, (req, res) => {
  try {
    const orgId = parseInt(req.params.id);
    const userId = req.user.userId;
    const targetUserId = parseInt(req.params.targetUserId);
    const { canPost, canComment, isBlocked } = req.body;

    const organization = db.prepare('SELECT * FROM organizations WHERE id = ?').get(orgId);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    if (organization.adminId !== userId) {
      const currentUserMember = db.prepare('SELECT role FROM organization_members WHERE organizationId = ? AND userId = ?').get(orgId, userId);
      if (currentUserMember?.role !== 'admin' && currentUserMember?.role !== 'moderator') {
        return res.status(403).json({ error: 'Only admin or moderator can update permissions' });
      }
    }

    const targetMember = db.prepare('SELECT * FROM organization_members WHERE organizationId = ? AND userId = ?').get(orgId, targetUserId);
    if (!targetMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Admin cannot be blocked or have permissions removed
    if (targetMember.role === 'admin' && (isBlocked || !canPost || !canComment)) {
      return res.status(400).json({ error: 'Cannot restrict admin permissions' });
    }

    db.prepare(`
      UPDATE organization_members 
      SET canPost = ?, canComment = ?, isBlocked = ?
      WHERE organizationId = ? AND userId = ?
    `).run(
      canPost !== undefined ? (canPost ? 1 : 0) : targetMember.canPost,
      canComment !== undefined ? (canComment ? 1 : 0) : targetMember.canComment,
      isBlocked !== undefined ? (isBlocked ? 1 : 0) : targetMember.isBlocked,
      orgId,
      targetUserId
    );

    res.json({ message: 'Permissions updated' });
  } catch (error) {
    console.error('Update permissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

