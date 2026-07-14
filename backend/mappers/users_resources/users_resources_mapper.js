import UsersResourcesMapperInterface from "./users_resources_mapper_interface.js";
import { db } from "../../database/init.js";

export default class UsersResourcesMapper extends UsersResourcesMapperInterface {
    constructor() {
        super();
    }

    create(userId, resourceId, count) {
        db.prepare(`
            INSERT INTO
                users_resources (userId, resourceId, count)
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

    updatePrice(userId, resourceId, newPrice) {
        db.prepare(`
            UPDATE
                users_resources
            SET
                price = ?
            WHERE
                userId = ?
                AND
                resourceId = ?        
        `).run(newPrice, userId, resourceId);
    }

    findByUserAndResource(userId, resourceId) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                users_resources
            WHERE
                userId = ?
                AND
                resourceId = ?    
        `).get(userId, resourceId);

        return result || null;
    }

    incrementUserResource(userId, resourceId, incrementValue) {
        db.prepare(`
            UPDATE
                users_resources
            SET
                count = count + ?
            WHERE
                userId = ?
                AND
                resourceId = ?        
        `).get(incrementValue, userId, resourceId);
    }
}