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

    getChatByOrg(chatId, userId) {
        try {
            return this.mapper.findChatByOrg(chatId, userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}