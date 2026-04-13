export class PostsMapperInterface {
    constructor() {
        if (new.target === 'PostsMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса PostsMapperInterface');
        }
    }

    /**
     * Возвращает количество постов, созданных пользователем
     * @param {int} userId
     * @returns {int} 
     */
    getTotalCountByUser(userId) {
        throw new Error('getTotalCountByUser должен быть переопределен в наследнике');
    }
}