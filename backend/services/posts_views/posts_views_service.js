import PostsViewsServiceInterface from "./posts_views_service_interface.js";

export default class PostsViewsService extends PostsViewsServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    create(userId, postId) {
        try {
            return this.mapper.insert(userId, postId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    get(userId, postId) {
        try {
            return this.mapper.find(userId, postId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}