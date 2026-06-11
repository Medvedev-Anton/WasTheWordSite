import ChatsMapperInterface from "./chats_mapper_interface.js";
import { db } from "../../database/init.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export default class ChatsMapper extends ChatsMapperInterface {
    constructor() {
        super();
    }

    addUserToChat(chatId, userId) {
        db.prepare(`
            INSERT INTO
                chat_participants(chatId, userId)
            VALUES(?, ?)    
        `).run(chatId, userId);
    }

    isUserInChat(chatId, userId) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                chat_participants
            WHERE
                chatId = ?
                AND
                userId = ?
        `).get(chatId, userId);

        return result !== undefined;
    }

    findChatByOrg(orgId) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                chats
            WHERE
                organizationId = ?    
        `).get(orgId);

        return result;
    }

    findById(id) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                chats
            WHERE
                id = ?    
        `).get(id);

        return result;
    }

    deleteAllByChatId(chatId) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const filesToDelete = db.prepare(`
            SELECT
                fileUrl
            FROM
                messages
            WHERE
                chatId = ?
                AND
                fileUrl IS NOT NULL
        `).all(chatId);

        filesToDelete.forEach(file => {
            if (file.fileUrl) {
                const filePath = path.join(__dirname, '../..', file.fileUrl.replace(/^\//, ''));

                if (fs.existsSync(filePath)) {
                    try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
                }
            }
        });

        db.prepare(`
            DELETE FROM
                messages
            WHERE
                chatId = ?    
        `).run(chatId);
    }

    deleteById(chatId) {
        db.prepare(`
            DELETE FROM
                chats
            WHERE
                id = ?    
        `).run(chatId);
    }

    deleteMessageById(messageId) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
    
        const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId);
        if (!message) {
            return false;
        }
    
        if (message.fileUrl && !message.fileDeleted) {
            const filePath = path.join(__dirname, '..', message.fileUrl.replace(/^\//, ''));
            if (fs.existsSync(filePath)) {
                try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
            }
        }
    
        db.prepare(`
            DELETE FROM
                messages
            WHERE
                id = ?
        `).run(messageId);
    }

    getAllMessages() {
        const result = db.prepare(`
            SELECT
                *
            FROM
                messages
        `).all();

        return result;
    }

    deleteAllExpiredMessages() {
        db.prepare(`
            DELETE FROM
                messages
            WHERE
                expiredAt <= datetime('now')
        `).run();
    }

    createLastUserMessageView(userId, chatId, lastReadedMessageId) {
        db.prepare(`
            INSERT INTO
                user_chat_view_cursor(userId, chatId, lastReadedMessageId)
            VALUES (?, ?, ?)    
        `).run(userId, chatId, lastReadedMessageId);
    }

    updateLastUserMessageView(userId, chatId, lastReadedMessageId) {
        db.prepare(`
            UPDATE
                user_chat_view_cursor
            SET
                lastReadedMessageId = ?
            WHERE
                userId = ?
                AND
                chatId = ?
        `).run(lastReadedMessageId, userId, chatId);
    }

    findLastUserMessageView(userId, chatId) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                user_chat_view_cursor
            WHERE
                userId = ?
                AND
                chatId = ?
        `).get(userId, chatId);

        if (result === undefined) {
            return null;
        }

        return result;
    }

    findLastReadedMessageId(chatId) {
        const result = db.prepare(`
            SELECT
                lastReadedMessageId
            FROM
                user_chat_view_cursor
            WHERE
                chatId = ?    
        `).get(chatId);

        if (result === undefined) {
            return null;
        }

        const lastReadedMessageId = parseInt(result.lastReadedMessageId);

        if (isNaN(lastReadedMessageId)) {
            return null;
        }

        return lastReadedMessageId;
    }
}