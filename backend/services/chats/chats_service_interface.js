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
}