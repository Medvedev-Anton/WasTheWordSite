export default class PostsViewsInterface {
    constructor() {
        if (new.target === 'PostsViewsInterface') {
            throw new Error('Нельзя создать экземпляр класса PostsViewsInterface');
        }
    }

    /**
     * Создать запись о просмотре
     * @param {number} userId
     * @param {number} postId
     */
    insert(userId, postId) {
        throw new Error('insert должен быть переопределен в наследнике');
    }

    /**
     * Получает запись о просмотре
     * @param {number} userId
     * @param {number} postId
     */
    find(userId, postId) {
        throw new Error('find должен быть переопределен в наследнике');
    }
}