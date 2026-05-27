import { BalanceMapperInterface } from "../../mappers/balance/balance_mapper_interface.js";

export class BalanceServiceInterface {
    /**
     * @param {BalanceMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'BalanceServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса BalanceServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Увеличивает баланс сущности
     * @param {int} entityId
     * @param {int} incrementValue
     */
    increment(entityId, incrementValue) {
        throw new Error('increment должен быть переопределен в наследнике');
    }

    /**
     * Уменьшает баланс сущности
     * @param {int} entityId
     * @param {int} decrementValue
     */
    decrement(entityId, decrementValue) {
        throw new Error('decrement должен быть переопределен в наследнике');
    }

    /**
     * Возвращает текущий баланс
     * @param {number} entityId
     * @returns {nubmer}
     */
    getBalance(entityId) {
        throw new Error('getBalance должен быть переопределен в наследнике');
    }
}