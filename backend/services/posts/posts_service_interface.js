import { PostsMapperInterface } from "../../mappers/posts/posts_mapper_interface.js";

export class PostsServiceInterface {
    /**
     * @param {PostsMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'PostsServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса PostsServiceInterface');
        }

        this.mapper = mapper;
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