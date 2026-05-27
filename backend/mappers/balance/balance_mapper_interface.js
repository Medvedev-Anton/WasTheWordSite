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