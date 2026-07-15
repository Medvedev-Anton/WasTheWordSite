import UsersSimpleItemsMapperInterface from "../../mappers/users_simple_items/users_simple_items_mapper_interface.js";

export default class UsersSimpleItemsServiceInterface {
    /**
     * @param {UsersSimpleItemsMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'UsersSimpleItemsServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса UsersSimpleItemsServiceInterface');
        }

        this.mapper = mapper;
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

    /**
     * Получение по пользователю и предмету
     * @param {number} userId
     * @param {number} simpleItemId
     */
    getByUserAndSimpleItem(userId, simpleItemId) {
        throw new Error('getByUserAndSimpleItem должен быть переопределен в наследнике');
    }

    /**
     * Создание или инкрементирование
     * @param {number} userId
     * @param {number} simpleItemId
     * @param {number} incrementValue
     */
    createOrIncrement(userId, simpleItemId, incrementValue = 1) {
        throw new Error('createOrIncrement должен быть переопределен в наследнике');
    }

    /**
     * Инкремент количества
     * @param {number} userId
     * @param {number} simpleItemId
     * @param {number} incrementValue
     */
    increment(userId, simpleItemId, incrementValue) {
        throw new Error('increment должен быть переопределен в наследнике');
    }
}