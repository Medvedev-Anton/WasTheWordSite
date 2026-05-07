export class BankParamsMapperInterface {
    constructor() {
        if (new.target === 'BankParamsMapperInterface') {
            return new Error('Нельзя создать экземпляр класса BankParamsMapperInterface');
        }
    }

    /**
     * Получает набор параметров банка
     * @param {int} bankId
     * @return {object}
     */
    getBankParams(bankId) {
        throw new Error('getBankParams должен быть переопределен в наследнике');
    }

    /**
     * Обновляет процент по кредиту для пользователей
     * @param {int} bankId
     * @param {int} newPercent
     * @return {void}
     */
    updateUserPercent(bankId, newPercent) {
        throw new Error('updateUserPercent должен быть переопределен в наследнике');
    }

    /**
     * Обновляет срок кредита для пользователей
     * @param {int} bankId
     * @param {int} newDuringDays
     * @return {void}
     */
    updateUserDuring(bankId, newDuringDays) {
        throw new Error('updateUserDuring должен быть переопределен в наследнике');
    }

    /**
     * Обновляет процент по кредиту для организаций
     * @param {int} bankId
     * @param {int} newPercent
     * @return {void}
     */
    updateOrgPercent(bankId, newPercent) {
        throw new Error('updateOrgPercent должен быть переопределен в наследнике');
    }

    /**
     * Обновляет срок кредита для организаций
     * @param {int} bankId
     * @param {int} newDuringDays
     * @return {void}
     */
    updateOrgDuring(bankId, newDuringDays) {
        throw new Error('updateOrgDuring должен быть переопределен в наследнике');
    }
}