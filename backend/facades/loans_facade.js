import { BankOrgParamsMapper } from "../mappers/bank_params/bank_org_params_mapper.js";
import { BankUserParamsMapper } from "../mappers/bank_params/bank_user_params_mapper.js";
import { LoansOrgsMapper } from "../mappers/loans/loans_orgs_mapper.js";
import { LoansUsersMapper } from "../mappers/loans/loans_users_mapper.js";
import { BankParamsService } from "../services/bank_params/bank_params_service.js";
import { LoansService } from "../services/loans_service/loans_service.js";

export class LoansFacade {
    constructor(entity) {
        if (entity === 'users') {
            this.service = new LoansService(
                new LoansUsersMapper()
            );

            this.bankService = new BankParamsService(
                new BankUserParamsMapper()
            );
        }
        else if (entity === 'orgs') {
            this.service = new LoansService(
                new LoansOrgsMapper()
            );

            this.bankService = new BankParamsService(
                new BankOrgParamsMapper()
            );
        }
        else {
            throw new Error('Неизвестная сущность заемщика: ' + entity);
        }
    }

    static entity(entity) {
        return new this(entity);
    }

    /**
     * Получить ID всех заемщиков кредитора
     * @param {int} creditorId
     */
    getAllBorrowersByCreditor(creditorId) {
        try {
            return this.service.getAllBorrowersByCreditor(creditorId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Вычисляет финальную сумму кредита
     * @param {number} sum
     * @param {number} percents
     * @param {number} days
     * @return {number}
     */
    calcFinalSum(sum, percents, days) {
        try {
            return this.service.calcFinalSum(sum, percents, days);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Вычисляет ежедневный платеж
     * @param {number} sum
     * @param {number} days
     * @return {number}
     */
    calcDailyPayment(sum, days) {
        try {
            return this.service.calcDailyPayment(sum, days);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Вычисляет все данные кредита пользователя
     * @param {number} bankId
     * @param {number} sum
     */
    calcLoanData(bankId, sum) {
        const bankParams = this.bankService.getBankEntityParams(bankId);
        
        if (bankParams === null) {
            throw new Error('Невозможно вычислить кредит: отсутствует запись в БД');
        }

        const percent = parseFloat(bankParams.percent);
        const during = parseInt(bankParams.during);
        
        const finalSum = this.calcFinalSum(sum, percent, during);
        const dailyPayment = this.calcDailyPayment(finalSum, during);

        return {
            finalSum: finalSum,
            during: during,
            percent: percent,
            dailyPayment: dailyPayment
        };
    }

    /**
     * Создать данные о кредите
     * @param {number} creditorId
     * @param {number} borrowerId
     * @param {number} startSum
     */
    static createLoan(creditorId, borrowerId, startSum) {
        try {
            return this.service.createLoan(creditorId, borrowerId, startSum);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}