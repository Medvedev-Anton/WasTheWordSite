import UsersSimpleItemsMapperInterface from "../../mappers/users_simple_items/users_simple_items_mapper_interface.js";

export default class UsersSimpleItemsServiceInterface {
    /**
     * @param {UsersSimpleItemsMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'UsersSimpleItemsServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса UsersSimpleItemsServiceInterface');
        }
    }

    /**
     * Создание записи
     * @param {number} userId
     * @param {number} simpleItemId
     * @param {number} count
     */
    create(userId, simpleItemId, count) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Удаление записи
     * @param {number} id
     */
    delete(id) {
        throw new Error('delete должен быть переопределен в наследнике');
    }

    /**
     * Получение всех предметов пользователя
     * @param {number} userId
     */
    getAllByUserId(userId) {
        throw new Error('getAllByUserId должен быть переопределен в наследнике');
    }
}