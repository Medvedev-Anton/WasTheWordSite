export class InitialBalancesMapperInterface {
    constructor() {
        if (new.target === 'InitialBalancesMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса InitialBalancesMapperInterface');
        }
    }

    /**
     * Получает начальный баланс по имени сущности
     * @param {string} name
     * @returns {int}
     */
    getBalanceByName(name) {
        throw new Error('getBalanceByName должен быть переопределен в наследник');
    }

    /**
     * Изменяет начальный баланс для сущности
     * @param {string} name
     * @param {int} balance
     * @returns {void}
     */
    updateBalanceByName(name, balance) {
        throw new Error('updateBalanceByName должен быть переопределен в наследник');
    }
}