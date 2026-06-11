import ChatsMapperInterface from "../../mappers/chats/chats_mapper_interface.js";

export default class ChatsServiceInterface {
    /**
     * @param {ChatsMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'ChatsServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса ChatsServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Добавляет участника в чат
     * @param {number} chatId
     * @param {number} userId
     */
    addUserToChat(chatId, userId) {
        throw new Error('addUserToChat должен быть переопределен в наследнике');
    }

    /**
     * Проверяет является ли пользователь участником чата
     * @param {number} chatId
     * @param {number} userId
     */
    isUserInChat(chatId, userId) {
        throw new Error('isUserInChat должен быть переопределен в наследнике');
    }

    /**
     * Получает данные чата организации
     * @param {number} orgId
     */
    getChatByOrg(orgId) {
        throw new Error('getChatByOrg должен быть переопределен в наследнике');
    }

    /**
     * Получает данные чата по id
     * @param {number} id
     */
    getById(id) {
        throw new Error('getById должен быть переопределен в наследнике');
    }

    /**
     * Удаляет все сообщения диалога
     * @param {number} chatId
     */
    deleteAllChatMessages(chatId) {
        throw new Error('deleteAllChatMessages должен быть переопределен в наследнике');
    }

    /**
     * Удаляет чат
     * @param {number} chatId
     */
    deleteById(chatId) {
        throw new Error('deleteById должен быть переопределен в наследнике');
    }

    /**
     * Удаляет сообщение
     * @param {number} messageId
     */
    deleteMessageById(messageId) {
        throw new Error('deleteMessageById должен быть переопределен в наследнике');
    }

    /**
     * Возвращает все сообщения
     */
    getAllMessages() {
        throw new Error('getAllMessages должен быть переопределен в наследнике');
    }

    /**
     * Проверяет не истек ли срок жизни сообщения
     * @param {string} messageCreatedAt
     * @param {number} liveDuringDays
     */
    isMessageExpired(messageCreatedAt, liveDuringDays) {
        throw new Error('isMessageExpired должен быть переопределен в наследнике');
    }

    /**
     * Удаляет все истекшие сообщения
     */
    deleteAllExpiredMessages() {
        throw new Error('deleteAllExpiredMessages должен быть переопределен в наследнике');
    }

    /**
     * Обновляет или создает запись о последнем просмотренном сообщении пользователя в чате
     * @param {number} userId
     * @param {number} chatId
     * @param {number} lastReadedMessageId
     */
    updateOrCreateLastUserMessageView(userId, chatId, lastReadedMessageId) {
        throw new Error('updateOrCreateLastUserMessageView должен быть переопределен в наследнике');
    }

    /**
     * Получает ID последнего прочитанного сообщения в чате
     * @param {number} chatId
     */
    getLastReadedMessageIdInChat(chatId) {
        throw new Error('getLastReadedMessageIdInChat должен быть переопределен в наследнике');
    }

    /**
     * Получает ID последнего прочитанного сообщения, которое отправил переданный пользователь
     * @param {number} senderId
     * @param {number} chatId
     */
    getLastReadedMessageSendedByUser(senderId, chatId) {
        throw new Error('getLastReadedMessageSendedByUser должен быть переопределен в наследнике');
    }

    /**
     * Получает ID последнего прочитанного сообщения, которое доставлено переданному пользователю
     * @param {number} userId
     * @param {number} chatId
     */
    getLastReadedMessageReceivedByUser(userId, chatId) {
        throw new Error('getLastReadedMessageReceivedByUser должен быть переопределен в наследнике');
    }

    /**
     * Получает данные организации по id чата
     * @param {number} chatId
     */
    getOrgByChat(chatId) {
        throw new Error('getOrgByChat должен быть переопределен в наследнике');
    }
}