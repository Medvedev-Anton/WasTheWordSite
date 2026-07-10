import UsersResourcesMapperInterface from "./users_resources_mapper_interface.js";
import { db } from "../../database/init.js";

export default class UsersResourcesMapper extends UsersResourcesMapperInterface {
    constructor() {
        super();
    }

    create(userId, resourceId, count) {
        db.prepare(`
            INSERT INTO
                users_resources
            VALUES (?, ?, ?)    
        `).run(userId, resourceId, count);
    }

    delete(id) {
        db.prepare(`
            DELETE FROM
                users_resources
            WHERE
                id = ?
        `).run(id);
    }

    findAllByUserId(userId) {
        const result = db.prepare(`
            SELECT
                r.*,
                u.count as count
            FROM
                users_resources u
            JOIN
                resources r
            ON
                u.resourceId = r.id
            WHERE
                u.userId = ?
        `).all(userId);

        return result;
    }
}