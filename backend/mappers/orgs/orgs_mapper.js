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

    getMaxCountSuborgsForSuborgsByUser(userId) {
        if (userId < 0) {
            throw new Error('userId не может быть отрицательным');
        }

        const result = db.prepare(`
            SELECT 
                o1.parentId,
                COUNT(o1.parentId) as cnt 
            FROM organizations o1 
            JOIN organizations o2 ON o1.parentId = o2.id
            WHERE 
                o2.parentId IS NOT NULL
                AND
                o1.adminId = ?
            GROUP BY o1.parentId
        `).all(userId);

        if (!result) {
            return 0;
        }

        if (!(result instanceof Array) || result.length === 0) {
            return 0;
        }

        const maxCount = parseInt(Math.max(...result.map(obj => obj.cnt)));

        if (isNaN(maxCount)) {
            return 0;
        }

        return maxCount;
    }
}