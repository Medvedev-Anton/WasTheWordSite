import ChatsServiceInterface from "./chats_service_interface.js";

export default class ChatsService extends ChatsServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    addUserToChat(chatId, userId) {
        try {
            return this.mapper.addUserToChat(chatId, userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    isUserInChat(chatId, userId) {
        try {
            return this.mapper.isUserInChat(chatId, userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getChatByOrg(orgId) {
        try {
            return this.mapper.findChatByOrg(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getById(id) {
        try {
            return this.mapper.findById(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаляет все сообщения диалога
     * @param {number} chatId
     */
    deleteAllChatMessages(chatId) {
        try {
            return this.mapper.deleteAllByChatId(chatId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}