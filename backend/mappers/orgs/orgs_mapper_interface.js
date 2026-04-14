export class OrgsMapperInterface {
    constructor() {
        if (new.target === 'OrgsMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса OrgsMapperInterface');
        }
    }

    /**
     * Возвращает количество организаций под авторством пользователя
     * @param {int} userId 
     * @returns {int}
     */
    getTotalCountByUser(userId) {
        throw new Error('getTotalCountByUser должен быть переопределен в наследнике');
    }
}