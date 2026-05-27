import { BalanceMapperInterface } from "./balance_mapper_interface.js";
import { db } from "../../database/init.js";

export class BalanceOrgsMapper extends BalanceMapperInterface {
    constructor() {
        super();
    }

    increment(orgId, incrementValue) {
        if (isNaN(parseInt(orgId))) {
            throw new Error('orgId должен быть целочисленным');
        }

        if (orgId < 0) {
            throw new Error('orgId должен быть неотрицательным');
        }

        db.prepare(`
            UPDATE
                organizations
            SET
                balance = balance + ?
            WHERE
                id = ?    
        `).run(incrementValue, orgId);
    }

    decrement(orgId, decrementValue) {
        if (isNaN(parseInt(orgId))) {
            throw new Error('orgId должен быть целочисленным');
        }

        if (orgId < 0) {
            throw new Error('orgId должен быть неотрицательным');
        }

        db.prepare(`
            UPDATE
                organizations
            SET
                balance = balance - ?
            WHERE
                id = ?    
        `).run(decrementValue, orgId);
    }

    getBalance(orgId) {
        if (isNaN(parseInt(orgId))) {
            throw new Error('orgId должен быть целочисленным');
        }

        if (orgId < 0) {
            throw new Error('orgId должен быть неотрицательным');
        }

        const result = db.prepare(`
            SELECT
                balance
            FROM
                organizations
            WHERE
                id = ?
        `).get(entityId);

        const balance = parseFloat(result.balance || 0);

        if (isNaN(balance)) {
            return 0;
        }

        return balance;
    }
}