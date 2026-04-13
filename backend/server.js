import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, db } from './database/init.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import organizationRoutes from './routes/organizations.js';
import chatRoutes from './routes/chats.js';
import messageRoutes from './routes/messages.js';
import adminRoutes from './routes/admin.js';
import rangsRouter from './routes/rangs.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
(async () => {
  try {
    await initDatabase();
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
})();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/messages', express.static(path.join(__dirname, 'uploads', 'messages')));
app.use('/uploads/organizations', express.static(path.join(__dirname, 'uploads', 'organizations')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rangs', rangsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Auto-delete message files older than 30 days
function cleanupOldFiles() {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = cutoff.toISOString();

    const oldMessages = db.prepare(
      `SELECT id, fileUrl, fileName, createdAt FROM messages WHERE fileUrl IS NOT NULL AND fileDeleted = 0 AND createdAt < ?`
    ).all(cutoffStr);

    for (const msg of oldMessages) {
      const filePath = path.join(__dirname, msg.fileUrl.replace(/^\//, ''));
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }
      db.prepare(
        `UPDATE messages SET fileDeleted = 1, fileDeletedAt = ? WHERE id = ?`
      ).run(new Date().toISOString(), msg.id);
    }

    if (oldMessages.length > 0) {
      console.log(`[Cleanup] Deleted ${oldMessages.length} old message file(s)`);
    }
  } catch (e) {
    console.error('[Cleanup] Error during file cleanup:', e.message);
  }
}

// Run cleanup once at startup and then every 6 hours
cleanupOldFiles();
setInterval(cleanupOldFiles, 6 * 60 * 60 * 1000);

