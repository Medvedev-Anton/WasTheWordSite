import UsersSimpleItemsMapperInterface from "./users_simple_items_mapper_interface.js";
import { db } from "../../database/init.js";

export default class UsersSimpleItemsMapper extends UsersSimpleItemsMapperInterface {
    constructor() {
        super();
    }

    create(userId, simpleItemId, count) {
        db.prepare(`
            INSERT INTO
                users_simple_items
            VALUES (?, ?, ?)    
        `).run(userId, simpleItemId, count);
    }

    delete(id) {
        db.prepare(`
            DELETE FROM
                users_simple_items
            WHERE
                id = ?
        `).run(id);
    }

    findAllByUserId(userId) {
        const result = db.prepare(`
            SELECT
                i.*,
                u.count as count
            FROM
                users_simple_items u
            JOIN
                simple_items i
            ON
                u.simpleItemId = i.id
            WHERE
                u.userId = ?
        `).all(userId);

        return result;
    }
}