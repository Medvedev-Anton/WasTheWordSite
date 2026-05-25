import { db } from "../../database/init.js";

export class BankParamsMapperInterface {
    constructor() {
        if (new.target === 'BankParamsMapperInterface') {
            return new Error('Нельзя создать экземпляр класса BankParamsMapperInterface');
        }
    }

    /**
     * Получает набор всех параметров банка
     * @param {int} bankId
     * @return {object}
     */
    getBankAllParams(bankId) {
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

    /**
     * Получает набор параметров банка только соответствующей сущности
     * @param {int} bankId
     * @return {object}
     */
    getBankEntityParams(bankId) {
        throw new Error('getBankEntityParams должен быть переопределен в наследнике');
    }

    /**
     * Создает строку с набором параметров банка по умолчанию
     * @param {int} bankId
     * @return {void}
     */
    createBankRowDefault(bankId) {
        if (bankId < 0) {
            throw new Error('bankId не может быть отрицательным');
        }

        if (isNaN(parseInt(bankId))) {
            throw new Error('bankId не может быть целочисленным');
        }

        db.prepare(`
            INSERT INTO 
                banks_loan_params(
                    bank_id,
                    loan_percent_users, 
                    loan_during_days_users,
                    loan_percent_orgs,
                    loan_during_days_orgs
                )
            VALUES(?, 0, 0, 0, 0)
        `).run(bankId);
    }

    /**
     * Обновляет процент по кредиту
     * @param {int} bankId
     * @param {int} newPercent
     * @return {void}
     */
    updateLoanPercent(bankId, newPercent) {
        throw new Error('updateLoanPercent должен быть переопределен в наследнике');
    }

    /**
     * Обновляет срок кредита
     * @param {int} bankId
     * @param {int} newDuringDays
     * @return {void}
     */
    updateLoanDuring(bankId, newDuringDays) {
        throw new Error('updateLoanDuring должен быть переопределен в наследнике');
    }
}