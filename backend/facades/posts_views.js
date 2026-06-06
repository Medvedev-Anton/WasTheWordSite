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
    static create(userId, postId) {
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
    static get(userId, postId) {
        try {
            return this.getService().get(userId, postId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Проверяет был ли уже просмотрен пост пользователем
     * @param {number} userId
     * @param {number} postId
     */
    static wasAlreadyViewed(userId, postId) {
        try {
            if (this.get(userId, postId)) {
                return true;
            }

            return false;
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}