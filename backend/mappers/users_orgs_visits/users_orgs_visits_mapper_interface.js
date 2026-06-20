export default class UsersOrgsVisitsMapperInterface {
    constructor() {
        if (new.target === 'UsersOrgsVisitsInterface') {
            throw new Error('Нельзя создать экземпляр класса UsersOrgsVisitsInterface');
        }
    }

    /**
     * Создание записи о посещении
     * @param {number} userId
     * @param {number} orgId
     */
    create(userId, orgId) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Получение записи о посещении
     * @param {number} userId
     * @param {number} orgId
     */
    find(userId, orgId) {
        throw new Error('find должен быть переопределен в наследнике');
    }
}