export class BalanceMapperInterface {
    constructor() {
        if (new.target === 'BalanceMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса BalanceMapperInterface');
        }
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