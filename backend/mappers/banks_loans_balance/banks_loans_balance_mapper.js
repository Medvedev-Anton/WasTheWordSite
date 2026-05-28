import { BanksLoansBalanceMapperInterface } from "./banks_loans_balance_mapper_interface.js";
import { db } from "../../database/init.js";

export class BanksLoansBalanceMapper extends BanksLoansBalanceMapperInterface {
    constructor() {
        super();
    }

    create(bankId, balance) {
        db.prepare(`
            INSERT INTO
                banks_loans_balances(bankId, balance)
            VALUES (?, ?)    
        `).run(bankId, balance);
    }

    increment(bankId, incrementValue) {
        db.prepare(`
            UPDATE
                banks_loans_balances
            SET
                balance = balance + ?
            WHERE
                bankId = ?
        `).run(incrementValue, bankId);
    }

    decrement(bankId, decrementValue) {
        db.prepare(`
            UPDATE
                banks_loans_balances
            SET
                balance = balance - ?
            WHERE
                bankId = ?
        `).run(decrementValue, bankId);
    }

    getBalance(bankId) {
        const result = db.prepare(`
            SELECT
                balance
            FROM
                banks_loans_balances
            WHERE
                bankId = ?
        `).get(bankId);

        const balance = parseInt(result.balance || 0);

        if (isNaN(balance)) {
            return 0;
        }

        return balance;
    }
}