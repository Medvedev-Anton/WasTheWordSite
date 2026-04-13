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

        if (userId < 0) {
            throw new Error('userId не может быть отрицательным');
        }

        const user = db.prepare(`
            SELECT 
                rangId
            FROM users
            WHERE
                id = ?
        `).get(userId);

        if (!user) {
            return -1;
        }

        return parseInt(user.rangId);
    }

    setRang(rangId, userId) {
        if (typeof userId !== 'number') {
            throw new Error('userId должен быть числовым');
        }

        if (typeof rangId !== 'number') {
            throw new Error('rangId должен быть числовым');
        }

        if (rangId < 0) {
            throw new Error('userId не может быть отрицательным');
        }

        if (userId < 0) {
            throw new Error('userId не может быть отрицательным');
        }

        db.prepare(`
            UPDATE users
            SET rangId = ?
            WHERE userId = ?
        `).run(rangId, userId);
    }
}