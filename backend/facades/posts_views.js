import PostsViewsMapper from "../mappers/posts_views/posts_views_mapper.js";
import PostsViewsService from "../services/posts_views/posts_views_service.js";

export default class PostsViewsFacade {
    static getService() {
        return new PostsViewsService(
            new PostsViewsMapper()
        );
    }

    /**
     * Создать запись о просмотре
     * @param {number} userId
     * @param {number} postId
     */
    create(userId, postId) {
        try {
            return this.getService().create(userId, postId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получает запись о просмотре
     * @param {number} userId
     * @param {number} postId
     */
    get(userId, postId) {
        try {
            return this.getService().get(userId, postId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}