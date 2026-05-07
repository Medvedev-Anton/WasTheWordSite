import { InitialBalancesMapper } from "../../mappers/initial_balances/initial_balances_mapper.js";

export class InitialBalancesServiceInterface {
    /**
     * @param {InitialBalancesMapper} mapper 
     */
    constructor(mapper) {
        if (new.target === 'InitialBalancesServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса InitialBalancesServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Получает начальный баланс пользователей
     * @returns {int}
     */
    getUserInitialBalance() {
        throw new Error('getUserInitialBalance должен быть переопределен в наследнике');
    }

    /**
     * Получает начальный баланс организаций
     * @returns {int}
     */
    getOrgInitialBalance() {
        throw new Error('getOrgInitialBalance должен быть переопределен в наследнике');
    }

    /**
     * Обновляет начальный баланс пользователей
     * @param {int} newBalance
     * @returns {void}
     */
    updateUserInitialBalance(newBalance) {
        throw new Error('updateUserInitialBalance должен быть переопределен в наследнике');
    }

    /**
     * Обновляет начальный баланс организаций
     * @param {int} newBalance
     * @returns {void}
     */
    updateOrgInitialBalance(newBalance) {
        throw new Error('updateOrgInitialBalance должен быть переопределен в наследнике');
    }
}