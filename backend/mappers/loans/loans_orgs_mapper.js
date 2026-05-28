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
                l.borrowerId as borrowerId,
                o.name as name,
                (l.currentSum * 100.0 / NULLIF(l.sumToPay, 0)) AS percent
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

    insertLoanData(creditorId, borrowerId, startSum, sumToPay, paymentSum) {
        db.prepare(`
            INSERT INTO
                orgs_loans (creditorId, borrowerId, startSum, currentSum, sumToPay, paymentSum)
            VALUES(?, ?, ?, ?, ?, ?)                
        `).run(creditorId, borrowerId, startSum, sumToPay, sumToPay, paymentSum);
    }

    decrementLoanSum(entityId) {
        db.prepare(`
            UPDATE
                orgs_loans
            SET
                currentSum = currentSum - paymentSum
            WHERE
                borrowerId = ?    
        `).run(entityId);
    }

    getPaymentSum(orgId) {
        const result = db.prepare(`
            SELECT
                paymentSum
            FROM
                orgs_loans
            WHERE
                borrowerId = ?    
        `).get(orgId);

        const sum = parseFloat(result.paymentSum || 0);

        if (isNaN(sum)) {
            return 0;
        }

        return sum;
    }

    getCurrentSum(orgId) {
        const result = db.prepare(`
            SELECT
                currentSum
            FROM
                orgs_loans
            WHERE
                borrowerId = ?    
        `).get(orgId);

        const sum = parseFloat(result.currentSum || 0);

        if (isNaN(sum)) {
            return 0;
        }

        return sum;
    }

    delete(orgId, bankId) {
        db.prepare(`
            DELETE FROM
                orgs_loans
            WHERE
                creditorId = ?
                AND
                borrowerId = ?
        `).run(bankId, orgId);
    }

    isEntityLoanExists(orgId) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                orgs_loans
            WHERE
                borrowerId = ? 
        `).get(orgId);

        return result !== undefined;
    }
}