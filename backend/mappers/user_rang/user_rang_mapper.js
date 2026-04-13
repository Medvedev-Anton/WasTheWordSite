import { UserRangMapperInterface } from "./user_rang_mapper_interface.js";
import { db } from "../../database/init.js";

export class UserRangMapper extends UserRangMapperInterface {
    constructor () {
        super();
    }

    getRang(userId) {
        if (userId <= 0) {
            throw new Error('userId не может быть неположительным');
        }

        const rangId = db.prepare(`
            SELECT 
                rangId
            FROM users
            WHERE
                id = ?
        `).get(userId);

        return rangId;
    }
}