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
      adminId INTEGER NOT NULL,
      defaultCanPost INTEGER DEFAULT 1,
      defaultCanComment INTEGER DEFAULT 1,
      isPrivate INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (adminId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  
  // Migrate existing organizations table
  const orgTableInfo = db.prepare("PRAGMA table_info(organizations)").all();
  const hasDefaultCanPost = orgTableInfo.some(col => col.name === 'defaultCanPost');
  const hasDefaultCanComment = orgTableInfo.some(col => col.name === 'defaultCanComment');
  const hasIsPrivate = orgTableInfo.some(col => col.name === 'isPrivate');
  
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
  
  // Update existing organizations
  try {
    db.exec(`UPDATE organizations SET defaultCanPost = 1 WHERE defaultCanPost IS NULL`);
    db.exec(`UPDATE organizations SET defaultCanComment = 1 WHERE defaultCanComment IS NULL`);
    db.exec(`UPDATE organizations SET isPrivate = 0 WHERE isPrivate IS NULL`);
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

  console.log('Database initialized successfully');
}

