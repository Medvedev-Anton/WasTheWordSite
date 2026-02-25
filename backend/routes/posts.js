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

// Helper function to attach files to posts
function attachFilesToPosts(posts) {
  if (!posts || posts.length === 0) return posts;
  
  const postIds = posts.map(p => p.id);
  if (postIds.length === 0) return posts;
  
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
  
  return posts;
}

// Get feed (all posts)
router.get('/feed', authenticateToken, (req, res) => {
  try {
    const posts = db.prepare(`
      SELECT 
        p.*,
        u.username as authorUsername,
        u.avatar as authorAvatar,
        u.firstName as authorFirstName,
        u.lastName as authorLastName,
        o.name as organizationName,
        o.avatar as organizationAvatar,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likesCount,
        (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentsCount,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id AND userId = ?) as isLiked,
        (SELECT COUNT(*) FROM posts WHERE repostOfId = p.id) as repostsCount,
        rp.id as repostedPostId,
        rp.content as repostedContent,
        rp.image as repostedImage,
        ru.username as repostedAuthorUsername,
        ru.avatar as repostedAuthorAvatar,
        ru.firstName as repostedAuthorFirstName,
        ru.lastName as repostedAuthorLastName
      FROM posts p
      LEFT JOIN users u ON p.authorId = u.id
      LEFT JOIN organizations o ON p.organizationId = o.id
      LEFT JOIN posts rp ON p.repostOfId = rp.id
      LEFT JOIN users ru ON rp.authorId = ru.id
      WHERE (u.isBanned = 0 OR u.isBanned IS NULL OR p.authorId IS NULL)
      ORDER BY p.createdAt DESC
    `).all(req.user.userId);

    // Attach files to posts
    const postsWithFiles = attachFilesToPosts(posts);

    res.json(postsWithFiles);
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get post by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const post = db.prepare(`
      SELECT 
        p.*,
        u.username as authorUsername,
        u.avatar as authorAvatar,
        u.firstName as authorFirstName,
        u.lastName as authorLastName,
        o.name as organizationName,
        o.avatar as organizationAvatar,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likesCount,
        (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentsCount,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id AND userId = ?) as isLiked
      FROM posts p
      LEFT JOIN users u ON p.authorId = u.id
      LEFT JOIN organizations o ON p.organizationId = o.id
      WHERE p.id = ?
    `).get(req.user.userId, postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Get files for this post
    const files = db.prepare(`
      SELECT id, fileUrl, fileName, fileType
      FROM post_files
      WHERE postId = ?
      ORDER BY id ASC
    `).all(postId);
    post.files = files;

    // Get comments
    const comments = db.prepare(`
      SELECT 
        c.*,
        u.username,
        u.avatar,
        u.firstName,
        u.lastName
      FROM comments c
      JOIN users u ON c.userId = u.id
      WHERE c.postId = ?
      ORDER BY c.createdAt ASC
    `).all(postId);

    res.json({ ...post, comments });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create post
router.post('/', authenticateToken, upload.array('files', 10), (req, res) => {
  try {
    const { content, organizationId, repostOfId } = req.body;
    const authorId = req.user.userId;

    if (!content && !repostOfId && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ error: 'Content, repost or file is required' });
    }

    // Check organization permissions if posting to organization
    const orgId = organizationId ? parseInt(organizationId) : null;
    if (orgId) {
      const organization = db.prepare('SELECT adminId FROM organizations WHERE id = ?').get(orgId);
      if (!organization) {
        return res.status(404).json({ error: 'Organization not found' });
      }

      // Admin can always post
      if (organization.adminId !== authorId) {
        const member = db.prepare('SELECT canPost, isBlocked FROM organization_members WHERE organizationId = ? AND userId = ?').get(orgId, authorId);
        if (!member) {
          return res.status(403).json({ error: 'You are not a member of this organization' });
        }
        if (member.isBlocked) {
          return res.status(403).json({ error: 'You are blocked in this organization' });
        }
        if (!member.canPost) {
          return res.status(403).json({ error: 'You do not have permission to post in this organization' });
        }
      }
    }

    const repostId = repostOfId ? parseInt(repostOfId) : null;
    
    // Ensure content is at least empty string if null
    const postContent = content || (req.files && req.files.length > 0 ? '' : null);

    // Insert post (keep image field for backward compatibility with old posts)
    const result = db.prepare(`
      INSERT INTO posts (content, image, authorId, organizationId, repostOfId)
      VALUES (?, ?, ?, ?, ?)
    `).run(postContent, null, authorId, orgId, repostId);

    // Handle multiple file uploads
    if (req.files && req.files.length > 0) {
      const insertFile = db.prepare(`
        INSERT INTO post_files (postId, fileUrl, fileName, fileType)
        VALUES (?, ?, ?, ?)
      `);
      
      for (const file of req.files) {
        const fileUrl = `/uploads/${file.filename}`;
        // Properly decode filename to handle Cyrillic characters
        let fileName;
        try {
          // Try multiple decoding strategies for Cyrillic characters
          let decoded = file.originalname;
          
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
              decoded = file.originalname;
            }
          }
          
          fileName = decoded;
        } catch (e) {
          fileName = file.originalname;
        }
        insertFile.run(result.lastInsertRowid, fileUrl, fileName, file.mimetype);
      }
    }

    const post = db.prepare(`
      SELECT 
        p.*,
        u.username as authorUsername,
        u.avatar as authorAvatar,
        u.firstName as authorFirstName,
        u.lastName as authorLastName,
        o.name as organizationName,
        o.avatar as organizationAvatar,
        0 as likesCount,
        0 as commentsCount,
        0 as isLiked,
        0 as repostsCount,
        rp.id as repostedPostId,
        rp.content as repostedContent,
        rp.image as repostedImage,
        ru.username as repostedAuthorUsername,
        ru.avatar as repostedAuthorAvatar,
        ru.firstName as repostedAuthorFirstName,
        ru.lastName as repostedAuthorLastName
      FROM posts p
      LEFT JOIN users u ON p.authorId = u.id
      LEFT JOIN organizations o ON p.organizationId = o.id
      LEFT JOIN posts rp ON p.repostOfId = rp.id
      LEFT JOIN users ru ON rp.authorId = ru.id
      WHERE p.id = ?
    `).get(result.lastInsertRowid);

    // Get files for this post
    const files = db.prepare(`
      SELECT id, fileUrl, fileName, fileType
      FROM post_files
      WHERE postId = ?
      ORDER BY id ASC
    `).all(result.lastInsertRowid);

    post.files = files;

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/Unlike post
router.post('/:id/like', authenticateToken, (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.userId;

    const existingLike = db.prepare('SELECT id FROM likes WHERE postId = ? AND userId = ?').get(postId, userId);

    if (existingLike) {
      db.prepare('DELETE FROM likes WHERE postId = ? AND userId = ?').run(postId, userId);
      res.json({ liked: false });
    } else {
      db.prepare('INSERT INTO likes (postId, userId) VALUES (?, ?)').run(postId, userId);
      res.json({ liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add comment
router.post('/:id/comments', authenticateToken, (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.userId;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Check organization permissions if commenting on organization post
    const post = db.prepare('SELECT organizationId FROM posts WHERE id = ?').get(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.organizationId) {
      const organization = db.prepare('SELECT adminId FROM organizations WHERE id = ?').get(post.organizationId);
      if (organization && organization.adminId !== userId) {
        const member = db.prepare('SELECT canComment, isBlocked FROM organization_members WHERE organizationId = ? AND userId = ?').get(post.organizationId, userId);
        if (!member) {
          return res.status(403).json({ error: 'You are not a member of this organization' });
        }
        if (member.isBlocked) {
          return res.status(403).json({ error: 'You are blocked in this organization' });
        }
        if (!member.canComment) {
          return res.status(403).json({ error: 'You do not have permission to comment in this organization' });
        }
      }
    }

    const result = db.prepare('INSERT INTO comments (postId, userId, content) VALUES (?, ?, ?)').run(postId, userId, content);

    const comment = db.prepare(`
      SELECT 
        c.*,
        u.username,
        u.avatar,
        u.firstName,
        u.lastName
      FROM comments c
      JOIN users u ON c.userId = u.id
      WHERE c.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(comment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete post
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.userId;

    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    db.prepare('DELETE FROM posts WHERE id = ?').run(postId);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

