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
}