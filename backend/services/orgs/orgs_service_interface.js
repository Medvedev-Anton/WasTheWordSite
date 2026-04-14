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
}