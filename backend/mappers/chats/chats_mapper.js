import ChatsMapperInterface from "./chats_mapper_interface.js";
import { db } from "../../database/init.js";

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

    deleteAllDialogMessages(chatId) {
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
                const filePath = path.join(__dirname, '..', file.fileUrl.replace(/^\//, ''));
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
}