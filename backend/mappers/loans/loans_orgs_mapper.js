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
                l.borrowerId,
                o.name,
                (l.currentSum * 100.0 / NULLIF(l.startSum, 0)) AS percent
            FROM 
                orgs_loans l
            JOIN
                organizations o
            ON
                o.id = l.borrowerId
            WHERE
                l.creditorId = ?    
        `).all(creditorId);

        return result;
    }
}