import { PostsMapper } from "../mappers/posts/posts_mapper.js";
import { PostsService } from "../services/posts/posts_service.js";

export class PostsFacade {
    /**
     * Возвращает количество постов, созданных пользователем
     * @param {int} userId
     * @returns {int} 
     */
    static getTotalCountByUser(userId) {
        const service = new PostsService(
            new PostsMapper()
        );

        try {
            return service.getTotalCountByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаление всех постов организации
     * @param {number} orgId
     */
    static deleteAllOrgPosts(orgId) {
        const service = new PostsService(
            new PostsMapper()
        );

        try {
            return service.deleteAllOrgPosts(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаление поста
     * @param {number} postId
     */
    static deleteById(postId) {
        const service = new PostsService(
            new PostsMapper()
        );

        try {
            return service.deleteById(postId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}