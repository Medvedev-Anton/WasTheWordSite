import { PostsMapperInterface } from "./posts_mapper_interface.js";
import { db } from "../../database/init.js";

export class PostsMapper extends PostsMapperInterface {
    constructor() {
        super();
    }

    getTotalCountByUser(userId) {
        if (userId <= 0) {
            throw new Error('userId не может быть неположительным');
        }

        const result = db.prepare(`
            SELECT
                id, COUNT(id) as cnt
            FROM posts p
            JOIN users u ON p.authorId = u.id
            WHERE
                u.id = ?
        `).get(userId);

        return parseInt(result.cnt);
    }
}