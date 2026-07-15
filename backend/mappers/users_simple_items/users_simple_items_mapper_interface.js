export default class UsersSimpleItemsMapperInterface {
    constructor() {
        if (new.target === 'UsersSimpleItemsMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса UsersSimpleItemsMapperInterface');
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
    findAllByUserId(userId) {
        throw new Error('findAllByUserId должен быть переопределен в наследнике');
    }

    /**
     * Получение по пользователю и предмету
     * @param {number} userId
     * @param {number} simpleItemId
     */
    findByUserAndSimpleItem(userId, simpleItemId) {
        throw new Error('findByUserAndSimpleItem должен быть переопределен в наследнике');
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