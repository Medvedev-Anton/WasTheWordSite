export class UserRangMapperInterface {
    constructor () {
        if (new.target === 'UserRangInterface') {
            throw new Error('Нельзя создать экземпляр класса UserRangInterface');
        }
    }

    /**
     * Возвращает ID ранга пользователя
     * @param {int} userId
     * @returns {int}
     */
    getRang(userId) {
        throw new Error('getRang должен быть переопределен в наследнике');
    }
}