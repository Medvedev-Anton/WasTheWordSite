import PostsViewsInterface from "./posts_views_mapper_interface.js";
import { db } from "../../database/init.js";

export default class PostsViewsMapper extends PostsViewsInterface {
    constructor() {
        super();
    }

    insert(userId, postId) {
        db.prepare(`
            INSERT INTO
                users_posts_views(userId, postId)
            VALUES(?, ?)    
        `).run(userId, postId);
    }

    find(userId, postId) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                users_posts_views
            WHERE
                userId = ?
                AND
                postId = ?
        `).get(userId, postId);

        return result;
    }
}