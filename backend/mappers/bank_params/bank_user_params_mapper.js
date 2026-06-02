import { BankParamsMapperInterface } from "./bank_params_mapper_interface.js";
import { db } from "../../database/init.js";

export class BankUserParamsMapper extends BankParamsMapperInterface {
    constructor() {
        super();
    }

    getBankEntityParams(bankId) {
        if (bankId < 0) {
            throw new Error('bankId не может быть отрицательным');
        }

        if (isNaN(parseInt(bankId))) {
            throw new Error('bankId не может быть целочисленным');
        }

        const result = db.prepare(`
            SELECT
                loan_percent_users as percent,
                loan_during_days_users as during
            FROM
                banks_loan_params
            WHERE
                bank_id = ?    
        `).get(bankId);

        return result || null;
    }

    updateLoanPercent(bankId, newPercent) {
        if (bankId < 0) {
            throw new Error('bankId не может быть отрицательным');
        }

        if (isNaN(parseInt(bankId))) {
            throw new Error('bankId не может быть целочисленным');
        }

        if (newPercent < 0) {
            throw new Error('newPercent не может быть отрицательным');
        }

        if (isNaN(parseInt(newPercent))) {
            throw new Error('newPercent не может быть целочисленным');
        }

        db.prepare(`
            UPDATE
                banks_loan_params
            SET
                loan_percent_users = ?
            WHERE
                bank_id = ?
        `).run(newPercent, bankId);
    }

    updateLoanDuring(bankId, newDuringDays) {
        if (bankId < 0) {
            throw new Error('bankId не может быть отрицательным');
        }

        if (isNaN(parseInt(bankId))) {
            throw new Error('bankId не может быть целочисленным');
        }

        if (newDuringDays < 0) {
            throw new Error('newDuringDays не может быть отрицательным');
        }

        if (isNaN(parseInt(newDuringDays))) {
            throw new Error('newDuringDays не может быть целочисленным');
        }

        db.prepare(`
            UPDATE
                banks_loan_params
            SET
                loan_during_days_users = ?
            WHERE
                bank_id = ?
        `).run(newDuringDays, bankId);
    }
}