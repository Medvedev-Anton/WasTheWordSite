import { PostsServiceInterface } from "./posts_service_interface.js";

export class PostsService extends PostsServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getTotalCountByUser(userId) {
        try {
            return this.mapper.getTotalCountByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    deleteAllOrgPosts(orgId) {
        try {
            return this.mapper.deleteAllOrgPosts(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    deleteById(postId) {
        try {
            return this.mapper.deleteById(postId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}