import PostsViewsMapperInterface from "../../mappers/posts_views/posts_views_mapper_interface.js";

export default class PostsViewsServiceInterface {
    /**
     * @param {PostsViewsMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'PostsViewsServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса PostsViewsServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Создать запись о просмотре
     * @param {number} userId
     * @param {number} postId
     */
    create(userId, postId) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Получает запись о просмотре
     * @param {number} userId
     * @param {number} postId
     */
    get(userId, postId) {
        throw new Error('get должен быть переопределен в наследнике');
    }
}