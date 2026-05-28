import { BanksLoansBalanceMapperInterface } from "../../mappers/banks_loans_balance/banks_loans_balance_mapper_interface.js";

export class BanksLoansBalanceServiceInterface {
    /**
     * @param {BanksLoansBalanceMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'BanksLoansBalanceServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса BanksLoansBalanceServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Создает запись
     * @param {number} bankId
     * @param {number} balance
     */
    create(bankId, balance) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Увеличивает баланс
     * @param {number} bankId
     * @param {number} incrementValue
     */
    increment(bankId, incrementValue) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Уменьшает баланс
     * @param {number} bankId
     * @param {number} decrementValue
     */
    decrement(bankId, decrementValue) {
        throw new Error('decrement должен быть переопределен в наследнике');
    }

    /**
     * Возвращает баланс
     * @param {number} bankId
     */
    getBalance(bankId) {
        throw new Error('getBalance должен быть переопределен в наследнике');
    }
}