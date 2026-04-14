import { OrgsMapperInterface } from "./orgs_mapper_interface.js";
import { db } from "../../database/init.js";

export class OrgsMapper extends OrgsMapperInterface {
    constructor() {
        super();
    }

    getTotalCountByUser(userId) {
        if (userId < 0) {
            throw new Error('userId не может быть отрицательным');
        }

        const result = db.prepare(`
            SELECT
                o.id, COUNT(o.id) as cnt
            FROM organizations o
            JOIN users u ON u.id = o.adminId
            WHERE u.id = ?
        `).get(userId);

        if (!result) {
            return 0;
        }

        return parseInt(result.cnt);
    }

    getTotalTopLevelCountByUser(userId) {
        if (userId < 0) {
            throw new Error('userId не может быть отрицательным');
        }

        const result = db.prepare(`
            SELECT
                o.id, COUNT(o.id) as cnt
            FROM organizations o
            JOIN users u ON u.id = o.adminId
            WHERE u.id = ? AND o.parentId IS NULL
        `).get(userId);

        if (!result) {
            return 0;
        }

        return parseInt(result.cnt);
    }
}