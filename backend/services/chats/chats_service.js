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

    deleteAllChatMessages(chatId) {
        try {
            return this.mapper.deleteAllByChatId(chatId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    deleteById(chatId) {
        try {
            return this.mapper.deleteById(chatId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    deleteMessageById(messageId) {
        try {
            return this.mapper.deleteMessageById(messageId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getAllMessages() {
        try {
            return this.mapper.getAllMessages();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    isMessageNotExpired(messageCreatedAt, liveDuringDays) {
        try {
            const creation = new Date(messageCreatedAt);
            const now = new Date();
            
            const expirationTime = creation.getTime() + (liveDuringDays * 24 * 60 * 60 * 1000);
            
            return now.getTime() <= expirationTime;
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    deleteAllExpiredMessages() {
        try {
            return this.mapper.deleteAllExpiredMessages();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateOrCreateLastUserMessageView(userId, chatId, lastReadedMessageId) {
        try {
            const lastMessageView = this.mapper.findLastUserMessageView(userId, chatId);

            if (lastMessageView === null) {
                return this.mapper.updateLastUserMessageView(userId, chatId, lastReadedMessageId);
            }

            return this.mapper.createLastUserMessageView(userId, chatId, lastReadedMessageId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getLastReadedMessageIdInChat(chatId) {
        try {
            return this.mapper.findLastReadedMessageId(chatId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getLastReadedMessageSendedByUser(senderId, chatId) {
        try {
            return this.mapper.findLastReadedMessageSendedByUser(chatId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}