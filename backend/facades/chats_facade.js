import ChatsMapper from "../mappers/chats/chats_mapper.js";
import ChatsService from "../services/chats/chats_service.js";
import { db } from "../database/init.js";

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

    /**
     * Получает данные чата по id
     * @param {number} id
     */
    static getById(id) {
        try {
            return this.getService().getById(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаляет чат
     * @param {number} chatId
     */
    static deleteById(chatId) {
        const transaction = db.transaction(() => {
            try {
                this.getService().deleteAllChatMessages(chatId);
                this.getService().deleteById(chatId);
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
        
        try {
            transaction();
        }
        catch (e) {
            throw new Error('Ошибка при обработке транзакции удаления диалога: ' + e.message);
        }
    }

    /**
     * Удаляет чат по ID организации
     * @param {number} orgId
     */
    static deleteByOrgId(orgId) {
        try {
            const chatId = this.getService().getChatByOrg(orgId)?.id;
            this.deleteById(chatId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаляет сообщение
     * @param {number} messageId
     */
    static deleteMessageById(messageId) {
        try {
            return this.getService().deleteMessageById(messageId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает все сообщения
     */
    static getAllMessages() {
        try {
            return this.getService().getAllMessages();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаляет все просроченные сообщения
     */
    static deleteAllExpiredMessages() {
        try {
            return this.getService().deleteAllExpiredMessages();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновляет или создает запись о последнем просмотренном сообщении пользователя в чате
     * @param {number} userId
     * @param {number} chatId
     * @param {number} lastReadedMessageId
     */
    static updateOrCreateLastUserMessageView(userId, chatId, lastReadedMessageId) {
        try {
            return this.getService().updateOrCreateLastUserMessageView(userId, chatId, lastReadedMessageId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получает ID последнего прочитанного сообщения в чате
     * @param {number} chatId
     */
    static getLastReadedMessageIdInChat(chatId) {
        try {
            return this.getService().getLastReadedMessageIdInChat(chatId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получает ID последнего прочитанного сообщения, которое отправил переданный пользователь
     * @param {number} senderId
     * @param {number} chatId
     */
    static getLastReadedMessageSendedByUser(senderId, chatId) {
        try {
            return this.getService().getLastReadedMessageSendedByUser(senderId, chatId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}