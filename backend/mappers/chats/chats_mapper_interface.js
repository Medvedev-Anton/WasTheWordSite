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
}