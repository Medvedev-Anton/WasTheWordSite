import { InitialBalancesMapperInterface } from "./initial_balances_mapper_interface.js";
import { db } from "../../database/init.js";

export class InitialBalancesMapper extends InitialBalancesMapperInterface {
    constructor() {
        super();
    }

    getBalanceByName(name) {
        const result = db.prepare(`
            SELECT
                value
            FROM initial_balances
            WHERE
                name = ?    
        `).get(name);

        if (!result) {
            return 0;
        }

        const balance = parseFloat(result.value || 0);

        if (isNaN(balance)) {
            return 0;
        }

        return balance;
    }

    updateBalanceByName(name, balance) {
        if (balance < 0) {
            throw new Error('начальный баланс не может быть отрпицательным');
        }

        const result = db.prepare(`
            UPDATE
                initial_balances
            SET value = ?
            WHERE
                name = ?    
        `).run(balance, name);
    }
}