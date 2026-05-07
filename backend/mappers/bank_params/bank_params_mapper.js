import { BankParamsMapperInterface } from "./bank_params_mapper_interface.js";
import { db } from "../../database/init.js";

export class BankParamsMapper extends BankParamsMapperInterface {
    constructor() {
        super();
    }

    getBankParams(bankId) {
        if (bankId < 0) {
            throw new Error('bankId не может быть отрицательным');
        }

        if (isNaN(parseInt(bankId))) {
            throw new Error('bankId не может быть целочисленным');
        }

        const result = db.prepare(`
            SELECT
                *
            FROM 
                banks_loan_params
            WHERE
                bank_id = ?
        `).get(bankId);

        return result;
    }

    updateUserPercent(bankId, newPercent) {
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

    updateUserDuring(bankId, newDuringDays) {
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
        `).run(newPercent, bankId);
    }

    updateOrgPercent(bankId, newPercent) {
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
                loan_percent_orgs = ?
            WHERE
                bank_id = ?
        `).run(newPercent, bankId);
    }

    updateOrgDuring(bankId, newDuringDays) {
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
                loan_during_days_orgs = ?
            WHERE
                bank_id = ?
        `).run(newPercent, bankId);
    }
}