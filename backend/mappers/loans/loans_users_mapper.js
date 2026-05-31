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
                l.borrowerId as borrowerId,
                u.username as name,
                (l.currentSum * 100.0 / NULLIF(l.sumToPay, 0)) AS percent
            FROM 
                users_loans l
            JOIN
                users u
            ON
                u.id = l.borrowerId
            WHERE
                l.creditorId = ?    
        `).all(creditorId);

        return result;
    }

    insertLoanData(creditorId, borrowerId, startSum, sumToPay, paymentSum) {
        db.prepare(`
            INSERT INTO
                users_loans (creditorId, borrowerId, startSum, currentSum, sumToPay, paymentSum)
            VALUES(?, ?, ?, ?, ?, ?)                
        `).run(creditorId, borrowerId, startSum, sumToPay, sumToPay, paymentSum);
    }

    decrementLoanSum(userId) {
        db.prepare(`
            UPDATE
                users_loans
            SET
                currentSum = currentSum - paymentSum
            WHERE
                borrowerId = ?    
        `).run(userId);
    }

    getPaymentSum(userId) {
        const result = db.prepare(`
            SELECT
                paymentSum
            FROM
                users_loans
            WHERE
                borrowerId = ?    
        `).get(userId);

        const sum = parseFloat(result.paymentSum || 0);

        if (isNaN(sum)) {
            return 0;
        }

        return sum;
    }

    getCurrentSum(userId) {
        const result = db.prepare(`
            SELECT
                currentSum
            FROM
                users_loans
            WHERE
                borrowerId = ?    
        `).get(userId);

        if (result === undefined) {
            return 0;
        }

        const sum = parseFloat(result.currentSum || 0);

        if (isNaN(sum)) {
            return 0;
        }

        return sum;
    }

    delete(userId, bankId) {
        db.prepare(`
            DELETE FROM
                users_loans
            WHERE
                creditorId = ?
                AND
                borrowerId = ?
        `).run(bankId, userId);
    }

    isEntityLoanExists(userId) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                users_loans
            WHERE
                borrowerId = ? 
        `).get(userId);

        return result !== undefined;
    }
}