export class OrgsServiceInterface {
    constructor(mapper) {
        if (new.target === 'OrgsServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса OrgsServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Возвращает количество организаций под авторством пользователя
     * @param {int} userId 
     * @returns {int}
     */
    getTotalCountByUser(userId) {
        throw new Error('getTotalCountByUser должен быть переопределен в наследнике');
    }

    /**
     * Возвращает количество организаций верхнего уровня под авторством пользователя
     * @param {int} userId 
     * @returns {int}
     */
    getTotalTopLevelCountByUser(userId) {
        throw new Error('getTotalCountByUser должен быть переопределен в наследнике');
    }

    /**
     * Возвращает максимальное кол-во подорганизаций у подорганизаций под авторством пользователя
     * @param {int} userId
     * @return {int}
     */
    getMaxCountSuborgsForSuborgsByUser(userId) {
        throw new Error('getMaxCountSuborgsForSuborgsByUser должен быть переопределен в наследнике');
    }
}