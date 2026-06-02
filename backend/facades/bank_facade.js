import { BankOrgParamsMapper } from "../mappers/bank_params/bank_org_params_mapper.js";
import { BankUserParamsMapper } from "../mappers/bank_params/bank_user_params_mapper.js";
import { BankParamsService } from "../services/bank_params/bank_params_service.js";
import { BankParamsServiceInterface } from "../services/bank_params/bank_params_service_interface.js";
import { db } from "../database/init.js";
import { BanksLoansBalanceFacade } from "./banks_loans_balance_facade.js";
import { BalanceFacade } from "./balance_facade.js";

export class BankFacade {
    constructor(entity) {
        if (entity === 'orgs') {
            this.service = new BankParamsService(
                new BankOrgParamsMapper()
            );
        }
        else if (entity === 'users') {
            this.service = new BankParamsService(
                new BankUserParamsMapper()
            );
        }
        else {
            throw new Error('Неизвестная сущность для работы с параметрами банков: ' + entity);
        }
    }

    static entity(entity) {
        return new this(entity);
    }

    /**
     * Получает набор параметров банка
     * @param {int} bankId
     * @return {object}
     */
    getBankAllParams(bankId) {
        try {
            return this.service.getBankAllParams(bankId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Создает строку с набором параметров банка по умолчанию
     * @param {int} bankId
     * @return {void}
     */
    createBankRowDefault(bankId) {
        try {
            return this.service.createBankRowDefault(bankId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновляет процент по кредиту
     * @param {int} bankId
     * @param {int} newPercent
     * @return {void}
     */
    updateLoanPercent(bankId, newPercent) {
        try {
            return this.service.updateLoanPercent(bankId, newPercent);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновляет срок кредита
     * @param {int} bankId
     * @param {int} newDuringDays
     * @return {void}
     */
    updateLoanDuring(bankId, newDuringDays) {
        try {
            return this.service.updateLoanDuring(bankId, newDuringDays);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Переводит с основного баланса банка на кредитный баланс
     * @param {number} bankId
     * @param {number} sum
     */
    static transferFromMainToLoanBalance(bankId, sum) {
        const transaction = db.transaction(() => {
            try {
                const currentMainBalance = BalanceFacade.entity('orgs').getBalance(bankId);

                if (currentMainBalance < sum) {
                    throw new Error('недостаточно средств для перевода');
                }

                BalanceFacade.entity('orgs').decrement(bankId, sum);
                BanksLoansBalanceFacade.increment(bankId, sum);
            }
            catch (e) {
                throw new Error(e.message);
            }
        });

        try {
            transaction();
        }
        catch (e) {
            throw new Error('Ошибка при обработке транзакции перевода между счетами банков: ' + e.message);
        }
    }
}