import { BanksLoansBalanceMapper } from "../mappers/banks_loans_balance/banks_loans_balance_mapper.js";
import { BanksLoansBalanceService } from "../services/banks_loans_balance/banks_loans_balance_service.js";

export class BanksLoansBalanceFacade {
    static getService() {
        return new BanksLoansBalanceService(
            new BanksLoansBalanceMapper()
        );
    }

    /**
     * Создает запись
     * @param {number} bankId
     * @param {number} balance
     */
    static create(bankId, balance) {
        try {
            return this.getService().create(bankId, balance);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Увеличивает баланс
     * @param {number} bankId
     * @param {number} incrementValue
     */
    static increment(bankId, incrementValue) {
        try {
            return this.getService().increment(bankId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Уменьшает баланс
     * @param {number} bankId
     * @param {number} decrementValue
     */
    static decrement(bankId, decrementValue) {
        try {
            return this.getService().decrement(bankId, decrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает баланс
     * @param {number} bankId
     */
    static getBalance(bankId) {
        try {
            return this.getService().getBalance(bankId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаляет запись о балансе
     * @param {number} bankId
     */
    static delete(bankId) {
        try {
            return this.getService().delete(bankId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}