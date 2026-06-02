import { db } from "../../database/init.js";
import NotificationsMapperInterface from "./notifications_mapper_interface.js";

export default class NotificationsMapper extends NotificationsMapperInterface {
    constructor() {
        super();
    }

    create(userId, message) {
        db.prepare(`
            INSERT INTO
                notifications (userId, message)
            VALUES (?, ?)    
        `).run(userId, message);
    }

    getAllByUser(userId) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                notifications
            WHERE
                userId = ?
        `).all(userId);

        return result;
    }

    delete(id) {
        db.prepare(`
            DELETE FROM
                notifications
            WHERE
                id = ? 
        `).run(id);
    }
}