import { LoansMapperInterface } from "./loans_mapper_interface.js";
import { db } from "../../database/init.js";

export class LoansUsersMapper extends LoansMapperInterface {
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
                u.username
            FROM 
                users_loans l
            JOIN
                users u
            ON
                u.id = l.borrowerId
            WHERE
                l.creditorId = ?    
        `).get(creditorId);

        return result;
    }
}