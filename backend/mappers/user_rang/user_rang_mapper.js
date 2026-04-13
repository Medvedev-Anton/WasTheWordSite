import { UserRangMapperInterface } from "./user_rang_mapper_interface.js";
import { db } from "../../database/init.js";

export class UserRangMapper extends UserRangMapperInterface {
    constructor () {
        super();
    }

    getRang(userId) {
        if (typeof userId !== 'number') {
            throw new Error('userId должен быть числовым');
        }

        if (userId <= 0) {
            throw new Error('userId не может быть неположительным');
        }

        const result = db.prepare(`
            SELECT 
                rangId
            FROM users
            WHERE
                id = ?
        `).get(userId);

        return result.rangId || -1;
    }

    setRang(rangId, userId) {
        if (typeof userId !== 'number') {
            throw new Error('userId должен быть числовым');
        }

        if (typeof rangId !== 'number') {
            throw new Error('rangId должен быть числовым');
        }

        if (rangId <= 0) {
            throw new Error('userId не может быть неположительным');
        }

        if (userId <= 0) {
            throw new Error('userId не может быть неположительным');
        }

        db.prepare(`
            UPDATE users
            SET rangId = ?
            WHERE userId = ?
        `).run(rangId, userId);
    }
}