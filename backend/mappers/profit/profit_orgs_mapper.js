import { ProfitMapperInterface } from "./profit_mapper_interface.js";
import { db } from "../../database/init.js";

export class ProfitOrgsMapper extends ProfitMapperInterface {
    constructor() {
        super();
    }

    insert(entityId, incomingSum) {
        if (isNaN(parseInt(entityId))) {
            throw new Error('entityId должен быть числовым');
        }

        if (isNaN(parseInt(incomingSum))) {
            throw new Error('incomingSum должен быть числовым');
        }

        if (entityId < 0) {
            throw new Error('incomingSum должен быть неотрицательным');
        }

        if (incomingSum < 0) {
            throw new Error('incomingSum должен быть неотрицательным');
        }

        const result = db.prepare(`
            INSERT INTO orgs_profit (orgId, incomingSum)
            VALUES (?, ?)    
        `).run(entityId, incomingSum);

        return result.lastInsertRowid;
    }

    getSumInDateInterval(entityId, dateStart, dateFinish) {
        if (isNaN(parseInt(entityId))) {
            throw new Error('entityId должен быть числовым');
        }

        if (entityId < 0) {
            throw new Error('incomingSum должен быть неотрицательным');
        }

        const result = db.prepare(`
            SELECT
                incomingSum,
                SUM(incomingSum) as totalSum
            FROM
                orgs_profit
            WHERE
                orgId = ?
                AND
                date BETWEEN ? AND ?
        `).get(entityId, dateStart, dateFinish);

        return result.totalSum || 0;
    }
}