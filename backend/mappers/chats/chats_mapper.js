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
}