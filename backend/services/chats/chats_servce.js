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
}