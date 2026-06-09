import ChatsMapper from "../mappers/chats/chats_mapper.js";
import ChatsService from "../services/chats/chats_servce.js";

export default class ChatsFacade {
    static getService() {
        return new ChatsService(
            new ChatsMapper()
        );
    }

    /**
     * Добавляет участника в чат
     * @param {number} chatId
     * @param {number} userId
     */
    addUserToChat(chatId, userId) {
        try {
            return this.getService().addUserToChat(chatId, userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}