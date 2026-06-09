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
    static addUserToChat(chatId, userId) {
        try {
            return this.getService().addUserToChat(chatId, userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Проверяет является ли пользователь участником чата
     * @param {number} chatId
     * @param {number} userId
     */
    static isUserInChat(chatId, userId) {
        try {
            return this.getService().isUserInChat(chatId, userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Проверяет является ли пользователь участником чата организации
     * @param {number} userId
     * @param {number} orgId
     */
    static isUserInOrgChat(userId, orgId) {
        try {
            const chatId = this.getService().getChatByOrg(orgId)?.id;

            if (chatId === undefined) {
                return false;
            }

            return this.getService().isUserInChat(chatId, userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}