import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.db');
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export async function initDatabase() {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstName TEXT,
      lastName TEXT,
      age INTEGER,
      work TEXT,
      about TEXT,
      avatar TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      isBanned INTEGER DEFAULT 0,
      allowMessagesFrom TEXT DEFAULT 'everyone',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrate existing users table to add role and isBanned columns if they don't exist
  const tableInfo = db.prepare("PRAGMA table_info(users)").all();
  const hasRole = tableInfo.some(col => col.name === 'role');
  const hasIsBanned = tableInfo.some(col => col.name === 'isBanned');
  const hasAllowMessagesFrom = tableInfo.some(col => col.name === 'allowMessagesFrom');
  const hasRang = tableInfo.some(col => col.name === 'rangId');

  if (!hasRole) {
    try {
      db.exec(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`);
    } catch (e) {
      console.error('Error adding role column:', e.message);
    }
  }
  if (!hasIsBanned) {
    try {
      db.exec(`ALTER TABLE users ADD COLUMN isBanned INTEGER DEFAULT 0`);
    } catch (e) {
      console.error('Error adding isBanned column:', e.message);
    }
  }
  if (!hasAllowMessagesFrom) {
    try {
      db.exec(`ALTER TABLE users ADD COLUMN allowMessagesFrom TEXT DEFAULT 'everyone'`);
    } catch (e) {
      console.error('Error adding allowMessagesFrom column:', e.message);
    }
  }
  if (!hasRang) {
    try {
      db.exec(`ALTER TABLE users ADD COLUMN rangId INT DEFAULT 0`);
      db.exec(`ALTER TABLE users ADD FOREIGN KEY (rangId) REFERENCES rangs(id)`)
    } catch (e) {
      console.error('Error adding allowMessagesFrom column:', e.message);
    }
  }
  // Update existing users
  try {
    db.exec(`UPDATE users SET role = 'user' WHERE role IS NULL OR role = ''`);
    db.exec(`UPDATE users SET isBanned = 0 WHERE isBanned IS NULL`);
    db.exec(`UPDATE users SET allowMessagesFrom = 'everyone' WHERE allowMessagesFrom IS NULL`);
  } catch (e) {
    console.error('Error updating users:', e.message);
  }

  // Add repostOfId to posts if not exists
  const postsTableInfo = db.prepare("PRAGMA table_info(posts)").all();
  const hasRepostOfId = postsTableInfo.some(col => col.name === 'repostOfId');
  if (!hasRepostOfId) {
    try {
      db.exec(`ALTER TABLE posts ADD COLUMN repostOfId INTEGER`);
    } catch (e) {
      console.error('Error adding repostOfId column:', e.message);
    }
  }

  // Create organizations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      avatar TEXT,
      coverImage TEXT,
      adminId INTEGER NOT NULL,
      defaultCanPost INTEGER DEFAULT 1,
      defaultCanComment INTEGER DEFAULT 1,
      isPrivate INTEGER DEFAULT 0,
      orgType TEXT DEFAULT 'Организация',
      parentId INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      longitude DECIMAL(9, 8) NULL,
      latitude DECIMAL(9, 8) NULL,
      FOREIGN KEY (adminId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (parentId) REFERENCES organizations(id) ON DELETE CASCADE
    )
  `);

  // Migrate existing organizations table
  const orgTableInfo = db.prepare("PRAGMA table_info(organizations)").all();
  const hasDefaultCanPost = orgTableInfo.some(col => col.name === 'defaultCanPost');
  const hasDefaultCanComment = orgTableInfo.some(col => col.name === 'defaultCanComment');
  const hasIsPrivate = orgTableInfo.some(col => col.name === 'isPrivate');
  const hasOrgType = orgTableInfo.some(col => col.name === 'orgType');
  const hasParentId = orgTableInfo.some(col => col.name === 'parentId');
  const hasLongitude = orgTableInfo.some(col => col.name === 'longitude');
  const hasLatitude = orgTableInfo.some(col => col.name === 'latitude');
  const hasCoverImage = orgTableInfo.some(col => col.name === 'coverImage');

  if (!hasDefaultCanPost) {
    try {
      db.exec(`ALTER TABLE organizations ADD COLUMN defaultCanPost INTEGER DEFAULT 1`);
    } catch (e) {
      console.error('Error adding defaultCanPost column:', e.message);
    }
  }
  if (!hasDefaultCanComment) {
    try {
      db.exec(`ALTER TABLE organizations ADD COLUMN defaultCanComment INTEGER DEFAULT 1`);
    } catch (e) {
      console.error('Error adding defaultCanComment column:', e.message);
    }
  }
  if (!hasIsPrivate) {
    try {
      db.exec(`ALTER TABLE organizations ADD COLUMN isPrivate INTEGER DEFAULT 0`);
    } catch (e) {
      console.error('Error adding isPrivate column:', e.message);
    }
  }
  if (!hasOrgType) {
    try {
      db.exec(`ALTER TABLE organizations ADD COLUMN orgType TEXT DEFAULT 'Организация'`);
    } catch (e) {
      console.error('Error adding orgType column:', e.message);
    }
  }
  if (!hasParentId) {
    try {
      db.exec(`ALTER TABLE organizations ADD COLUMN parentId INTEGER REFERENCES organizations(id) ON DELETE CASCADE`);
    } catch (e) {
      console.error('Error adding parentId column:', e.message);
    }
  }
  if (!hasLongitude) {
    try {
      db.exec(`ALTER TABLE organizations ADD COLUMN longitude DECIMAL(9, 8) NULL`);
    }
    catch (e) {
      console.error('Error adding longitude column:', e.message);
    }
  }
  if (!hasLatitude) {
    try {
      db.exec(`ALTER TABLE organizations ADD COLUMN latitude DECIMAL(9, 8) NULL`);
    }
    catch (e) {
      console.error('Error adding latitude column:', e.message);
    }
  }
  if (!hasCoverImage) {
    try {
      db.exec(`ALTER TABLE organizations ADD COLUMN coverImage TEXT`);
    } catch (e) {
      console.error('Error adding coverImage column:', e.message);
    }
  }


  // Update existing organizations
  try {
    db.exec(`UPDATE organizations SET defaultCanPost = 1 WHERE defaultCanPost IS NULL`);
    db.exec(`UPDATE organizations SET defaultCanComment = 1 WHERE defaultCanComment IS NULL`);
    db.exec(`UPDATE organizations SET isPrivate = 0 WHERE isPrivate IS NULL`);
    db.exec(`UPDATE organizations SET orgType = 'Организация' WHERE orgType IS NULL`);
  } catch (e) {
    console.error('Error updating organizations:', e.message);
  }

  // Create organization_members table (for members, moderators)
  db.exec(`
    CREATE TABLE IF NOT EXISTS organization_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organizationId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      canPost INTEGER DEFAULT 1,
      canComment INTEGER DEFAULT 1,
      isBlocked INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(organizationId, userId)
    )
  `);

  // Migrate existing organization_members table
  const orgMembersTableInfo = db.prepare("PRAGMA table_info(organization_members)").all();
  const hasCanPost = orgMembersTableInfo.some(col => col.name === 'canPost');
  const hasCanComment = orgMembersTableInfo.some(col => col.name === 'canComment');
  const hasIsBlocked = orgMembersTableInfo.some(col => col.name === 'isBlocked');

  if (!hasCanPost) {
    try {
      db.exec(`ALTER TABLE organization_members ADD COLUMN canPost INTEGER DEFAULT 1`);
    } catch (e) {
      console.error('Error adding canPost column:', e.message);
    }
  }
  if (!hasCanComment) {
    try {
      db.exec(`ALTER TABLE organization_members ADD COLUMN canComment INTEGER DEFAULT 1`);
    } catch (e) {
      console.error('Error adding canComment column:', e.message);
    }
  }
  if (!hasIsBlocked) {
    try {
      db.exec(`ALTER TABLE organization_members ADD COLUMN isBlocked INTEGER DEFAULT 0`);
    } catch (e) {
      console.error('Error adding isBlocked column:', e.message);
    }
  }

  // Update existing members
  try {
    db.exec(`UPDATE organization_members SET canPost = 1 WHERE canPost IS NULL`);
    db.exec(`UPDATE organization_members SET canComment = 1 WHERE canComment IS NULL`);
    db.exec(`UPDATE organization_members SET isBlocked = 0 WHERE isBlocked IS NULL`);
  } catch (e) {
    console.error('Error updating organization_members:', e.message);
  }

  // Create posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      image TEXT,
      authorId INTEGER,
      organizationId INTEGER,
      repostOfId INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (repostOfId) REFERENCES posts(id) ON DELETE SET NULL
    )
  `);

  // Migrate existing posts table - remove NOT NULL constraint from content if needed
  try {
    const postsTableInfo = db.prepare("PRAGMA table_info(posts)").all();
    const contentColumn = postsTableInfo.find(col => col.name === 'content');
    const hasRepostOfId = postsTableInfo.some(col => col.name === 'repostOfId');

    // Check if we need to add repostOfId column
    if (!hasRepostOfId) {
      db.exec(`ALTER TABLE posts ADD COLUMN repostOfId INTEGER`);
      db.exec(`CREATE INDEX IF NOT EXISTS idx_posts_repostOfId ON posts(repostOfId)`);
    }

    // Note: SQLite doesn't support ALTER TABLE to modify column constraints directly
    // The NOT NULL constraint will be ignored for new inserts if we use NULL explicitly
    // For existing tables, we'll handle it in the application code
  } catch (e) {
    console.error('Error checking posts table structure:', e.message);
  }

  // Create post_files table for multiple files per post
  db.exec(`
    CREATE TABLE IF NOT EXISTS post_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER NOT NULL,
      fileUrl TEXT NOT NULL,
      fileName TEXT,
      fileType TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
    )
  `);

  // Create likes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(postId, userId)
    )
  `);

  // Create comments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create chats table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT NOT NULL DEFAULT 'personal',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create chat_participants table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chatId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chatId) REFERENCES chats(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(chatId, userId)
    )
  `);

  // Create messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chatId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      content TEXT NOT NULL,
      fileUrl TEXT,
      fileName TEXT,
      fileType TEXT,
      fileDeleted INTEGER DEFAULT 0,
      fileDeletedAt TEXT,
      isDeleted INTEGER DEFAULT 0,
      deletedAt TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chatId) REFERENCES chats(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Migrate existing messages table to add file columns if they don't exist
  const messagesTableInfo = db.prepare("PRAGMA table_info(messages)").all();
  const hasFileUrl = messagesTableInfo.some(col => col.name === 'fileUrl');
  const hasFileName = messagesTableInfo.some(col => col.name === 'fileName');
  const hasFileType = messagesTableInfo.some(col => col.name === 'fileType');

  if (!hasFileUrl) {
    try {
      db.exec(`ALTER TABLE messages ADD COLUMN fileUrl TEXT`);
    } catch (e) {
      console.error('Error adding fileUrl column:', e.message);
    }
  }
  if (!hasFileName) {
    try {
      db.exec(`ALTER TABLE messages ADD COLUMN fileName TEXT`);
    } catch (e) {
      console.error('Error adding fileName column:', e.message);
    }
  }
  if (!hasFileType) {
    try {
      db.exec(`ALTER TABLE messages ADD COLUMN fileType TEXT`);
    } catch (e) {
      console.error('Error adding fileType column:', e.message);
    }
  }

  const hasFileDeleted = messagesTableInfo.some(col => col.name === 'fileDeleted');
  const hasFileDeletedAt = messagesTableInfo.some(col => col.name === 'fileDeletedAt');
  const hasIsDeleted = messagesTableInfo.some(col => col.name === 'isDeleted');
  const hasDeletedAt = messagesTableInfo.some(col => col.name === 'deletedAt');
  if (!hasFileDeleted) {
    try {
      db.exec(`ALTER TABLE messages ADD COLUMN fileDeleted INTEGER DEFAULT 0`);
    } catch (e) {
      console.error('Error adding fileDeleted column:', e.message);
    }
  }
  if (!hasFileDeletedAt) {
    try {
      db.exec(`ALTER TABLE messages ADD COLUMN fileDeletedAt TEXT`);
    } catch (e) {
      console.error('Error adding fileDeletedAt column:', e.message);
    }
  }
  if (!hasIsDeleted) {
    try {
      db.exec(`ALTER TABLE messages ADD COLUMN isDeleted INTEGER DEFAULT 0`);
    } catch (e) {
      console.error('Error adding isDeleted column:', e.message);
    }
  }
  if (!hasDeletedAt) {
    try {
      db.exec(`ALTER TABLE messages ADD COLUMN deletedAt TEXT`);
    } catch (e) {
      console.error('Error adding deletedAt column:', e.message);
    }
  }

  // Migrate chats table: add avatar and organizationId columns
  const chatsTableInfo = db.prepare("PRAGMA table_info(chats)").all();
  const hasChatAvatar = chatsTableInfo.some(col => col.name === 'avatar');
  const hasChatOrgId = chatsTableInfo.some(col => col.name === 'organizationId');
  if (!hasChatAvatar) {
    try {
      db.exec(`ALTER TABLE chats ADD COLUMN avatar TEXT`);
    } catch (e) {
      console.error('Error adding avatar column to chats:', e.message);
    }
  }
  if (!hasChatOrgId) {
    try {
      db.exec(`ALTER TABLE chats ADD COLUMN organizationId INTEGER`);
    } catch (e) {
      console.error('Error adding organizationId column to chats:', e.message);
    }
  }

  // Create user_photos table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      photoUrl TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create organization_icon table
  db.exec(`
    CREATE TABLE IF NOT EXISTS organization_icon (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orgType TEXT NOT NULL,
      imageUrl TEXT NOT NULL
    )`);

  const defaultImagesExist = db.prepare("SELECT COUNT(*) as count FROM organization_icon WHERE id = 1").get();
  if (defaultImagesExist.count === 0) {
    db.exec(`
      INSERT INTO organization_icon (id, orgType, imageUrl) VALUES
      (1, 'DEFAULT', '/uploads/organizations/default.jpg')
    `);
  }

  const hasOrganizationIconId = orgTableInfo.some(col => col.name === 'organization_icon_id');
  if (!hasOrganizationIconId) {
    try {
      db.exec(`ALTER TABLE organizations ADD COLUMN organization_icon_id INTEGER DEFAULT 1`);
    } catch (e) {
      console.error('Error adding organization_icon_id column:', e.message);
    }
  }

  try {
    db.exec(`
      UPDATE organizations SET organization_icon_id = 1 WHERE organization_icon_id IS NULL
      `
    );
  }
  catch (e) {
    console.error('Error UPDATE organizations SET organization_icon_id = 1 WHERE organization_icon_id IS NULL:', e.message);
  }

  // Create organization_cover table (preset covers library + type defaults)
  db.exec(`
    CREATE TABLE IF NOT EXISTS organization_cover (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imageUrl TEXT NOT NULL,
      orgType TEXT DEFAULT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrate: add orgType to organization_cover if not exists
  const coverTableInfo = db.prepare("PRAGMA table_info(organization_cover)").all();
  const hasCoverOrgType = coverTableInfo.some(col => col.name === 'orgType');
  if (!hasCoverOrgType) {
    try {
      db.exec(`ALTER TABLE organization_cover ADD COLUMN orgType TEXT DEFAULT NULL`);
    } catch (e) {
      console.error('Error adding orgType to organization_cover:', e.message);
    }
  }

  // Add organization_cover_id to organizations if not exists
  const hasOrganizationCoverId = orgTableInfo.some(col => col.name === 'organization_cover_id');
  if (!hasOrganizationCoverId) {
    try {
      db.exec(`ALTER TABLE organizations ADD COLUMN organization_cover_id INTEGER DEFAULT NULL`);
    } catch (e) {
      console.error('Error adding organization_cover_id column:', e.message);
    }
  }

  // Create rangs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS rangs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      thumbnail_url TEXT NOT NULL,
      orderNumber INTEGER NOT NULL
    )
  `);

  const rangsTableInfo = db.prepare("PRAGMA table_info(rangs)").all();
  const hasOrderNumber = rangsTableInfo.some(col => col.name === 'orderNumber');
  if (!hasOrderNumber) {
    try {
      db.exec(`ALTER TABLE rangs ADD COLUMN orderNumber INTEGER DEFAULT NULL`);
    } catch (e) {
      console.error('Error adding orderNumber to rangs:', e.message);
    }
  }

  const defaultRangs = [
    { name: 'НПС 0', thumbnail_url: '/uploads/rangs/0.png', orderNumber: 0 },
    { name: 'НПС 1', thumbnail_url: '/uploads/rangs/1.png', orderNumber: 1 },
    { name: 'НПС 2', thumbnail_url: '/uploads/rangs/2.png', orderNumber: 2 },
    { name: 'НПС 3', thumbnail_url: '/uploads/rangs/3.png', orderNumber: 3 },
    { name: 'НПС 4', thumbnail_url: '/uploads/rangs/4.png', orderNumber: 4 },
    { name: 'НПС 5', thumbnail_url: '/uploads/rangs/5.png', orderNumber: 5 },
    { name: 'Младший Зам- Координатор', thumbnail_url: '/uploads/rangs/6.png', orderNumber: 6 },
    { name: 'Зам- Координатор', thumbnail_url: '/uploads/rangs/7.png', orderNumber: 7 },
    { name: 'Старший  Зам - Координатор', thumbnail_url: '/uploads/rangs/8.png', orderNumber: 8 },
    { name: 'Суб-Мастер', thumbnail_url: '/uploads/rangs/9.png', orderNumber: 9 },
    { name: 'Старший Суб-мастер', thumbnail_url: '/uploads/rangs/10.png', orderNumber: 10 },
    { name: 'Младший Старт- Координатор', thumbnail_url: '/uploads/rangs/11.png', orderNumber: 11 },
    { name: 'Старт- Координатор', thumbnail_url: '/uploads/rangs/12.png', orderNumber: 12 },
    { name: 'Старший  Старт- Координатор', thumbnail_url: '/uploads/rangs/13.png', orderNumber: 13 },
    { name: 'Младший  Суб- Координатор', thumbnail_url: '/uploads/rangs/14.png', orderNumber: 14 },
    { name: 'Суб- Координатор', thumbnail_url: '/uploads/rangs/15.png', orderNumber: 15 },
    { name: 'Старший  Суб- Координатор', thumbnail_url: '/uploads/rangs/16.png', orderNumber: 16 },
    { name: 'Штаб – Координатор III ранга', thumbnail_url: '/uploads/rangs/17.png', orderNumber: 17 },
    { name: 'Штаб – Координатор II ранга', thumbnail_url: '/uploads/rangs/18.png', orderNumber: 18 },
    { name: 'Штаб – Координатор I ранга', thumbnail_url: '/uploads/rangs/189.png', orderNumber: 19 },
    { name: 'Арт - Координатор', thumbnail_url: '/uploads/rangs/20.png', orderNumber: 20 },
  ];

  defaultRangs.forEach(rang => {
    const rangSelect = db.prepare(`SELECT COUNT(*) as count FROM rangs WHERE name = ?`).get(rang.name);

    if (rangSelect.count === 0) {
      db.prepare(`
        INSERT INTO rangs (name, thumbnail_url, orderNumber) 
        VALUES (?, ?, ?)
      `).run(rang.name, rang.thumbnail_url, rang.orderNumber);
    }
  });
  
  console.log('Database initialized successfully');
}

