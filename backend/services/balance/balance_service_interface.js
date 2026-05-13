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
}