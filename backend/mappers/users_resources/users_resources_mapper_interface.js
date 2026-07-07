export default class UsersResourcesMapperInterface {
    constructor() {
        if (new.target === 'UsersResourcesMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса UsersResourcesMapperInterface');
        }
    }

    /**
     * Создание записи
     * @param {number} userId
     * @param {number} resourceId
     * @param {number} count
     */
    create(userId, resourceId, count) {
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
     * Получение всех ресурсов пользователя
     * @param {number} userId
     */
    findAllByUserId(userId) {
        throw new Error('findAllByUserId должен быть переопределен в наследнике');
    }
}