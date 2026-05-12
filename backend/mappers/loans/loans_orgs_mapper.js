import { LoansMapperInterface } from "./loans_mapper_interface.js";
import { db } from "../../database/init.js";

export class LoansOrgsMapper extends LoansMapperInterface {
    constructor() {
        super();
    }

    getAllBorrowersByCreditor(creditorId) {
        if (creditorId < 0) {
            throw new Error('creditorId не может быть отрицательным');
        }

        if (isNaN(parseInt(creditorId))) {
            throw new Error('creditorId должен быть целочисленным');
        }

        const result = db.prepare(`
            SELECT
                borrowerId
            FROM 
                ${this.tableName}
            WHERE
                creditorId = ?    
        `).get(creditorId);

        return result;
    }
}