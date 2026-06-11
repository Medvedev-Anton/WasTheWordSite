export default class ChatsMapperInterface {
    constructor() {
        if (new.target === 'ChatsMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса ChatsMapperInterface');
        }
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
    findChatByOrg(orgId) {
        throw new Error('findChatByOrg должен быть переопределен в наследнике');
    }

    /**
     * Получает данные чата по id
     * @param {number} id
     */
    findById(id) {
        throw new Error('findById должен быть переопределен в наследнике');
    }

    /**
     * Удаляет все сообщения диалога
     * @param {number} chatId
     */
    deleteAllByChatId(chatId) {
        throw new Error('deleteAllDialogMessages должен быть переопределен в наследнике');
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
     * Удаляет все истекшие сообщения
     */
    deleteAllExpiredMessages() {
        throw new Error('deleteAllExpiredMessages должен быть переопределен в наследнике');
    }

    /**
     * Создает запись о просмотре последнего сообщения
     * @param {number} userId
     * @param {number} chatId
     * @param {number} lastReadedMessageId
     */
    createLastUserMessageView(userId, chatId, lastReadedMessageId) {
        throw new Error('createLastUserMessageView должен быть переопределен в наследнике');
    }

    /**
     * Обновляет запись о просмотре последнего сообщения
     * @param {number} userId
     * @param {number} chatId
     * @param {number} lastReadedMessageId
     */
    updateLastUserMessageView(userId, chatId, lastReadedMessageId) {
        throw new Error('updateLastUserMessageView должен быть переопределен в наследнике');
    }

    /**
     * Получает запись о просмотре последнего сообщения
     * @param {number} userId
     * @param {number} chatId
     */
    findLastUserMessageView(userId, chatId) {
        throw new Error('findLastUserMessageView должен быть переопределен в наследнике');
    }

    /**
     * Получает ID последнего прочитанного сообщения в чате
     * @param {number} chatId
     */
    findLastReadedMessageId(chatId) {
        throw new Error('findLastReadedMessageId должен быть переопределен в наследнике');
    }

    /**
     * Получает ID последнего прочитанного сообщения, которое отправил переданный пользователь
     * @param {number} senderId
     * @param {number} chatId
     */
    findLastReadedMessageSendedByUser(senderId, chatId) {
        throw new Error('findLastReadedMessageSendedByUser должен быть переопределен в наследнике');
    }
}