import { TaxesMapperInterface } from "../../mappers/taxes/taxes_mapper_interface.js";

export class TaxesServiceInterface {
    /**
     * @param {TaxesMapperInterfaceface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'TaxesServiceInterface') {
            throw new Error('TaxesServiceInterface должен быть переопределен в наследнике');
        }

        this.mapper = mapper;
    }

    /**
     * Получить налог для пользователей
     */
    getUsersTaxPercent() {
        throw new Error('getUsersTaxPercent должен быть переопределен в наследнике');
    }

    /**
     * Получить налог для организаций
     */
    getOrgsTaxPercent() {
        throw new Error('getOrgsTaxPercent должен быть переопределен в наследнике');
    }

    /**
     * Обновляет налог пользователей
     * @param {int} newTax 
     */
    updateUsersTaxPercent(newTax) {
        throw new Error('updateUsersTaxPercent должен быть переопределен в наследнике');
    }

    /**
     * Обновляет налог организаций
     * @param {int} newTax
     */
    updateOrgsTaxPercent(newTax) {
        throw new Error('updateOrgsTaxPercent должен быть переопределен в наследнике');
    }

    /**
     * Расчитывает величину налога с поступления
     * @param {int} income
     * @param {int} taxPercent
     * @return {int}
     */
    calcTaxByIncome(income, taxPercent) {
        throw new Error('calcTaxByIncome должен быть переопределен в наследнике');
    }

    /**
     * Увеличивает текущую сумму налога пользователя
     * @param {int} userId
     * @param {int} incrementValue
     */
    incrementCurrentUserTax(userId, incrementValue) {
        throw new Error('incrementCurrentUserTax должен быть переопределен в наследнике');
    }

    /**
     * Увеличивает текущую сумму налога организации
     * @param {int} orgId
     * @param {int} incrementValue
     */
    incrementCurrentOrgTax(orgId, incrementValue) {
        throw new Error('incrementCurrentOrgTax должен быть переопределен в наследнике');
    }

    /**
     * Создает запись о сумме налога пользователя
     * @param {int} userId
     * @param {int} tax
     */
    createCurrentUserTax(userId, tax) {
        throw new Error('createCurrentUserTax должен быть переопределен в наследнике');
    }

    /**
     * Создает запись о сумме налога организации
     * @param {int} orgId
     * @param {int} tax
     */
    createCurrentOrgTax(orgId, tax) {
        throw new Error('createCurrentOrgTax должен быть переопределен в наследнике');
    }

    /**
     * Получает текущее значение налога пользователя
     * @param {int} userId
     * @return {int}
     */
    getCurrentUserTax(userId) {
        throw new Error('getCurrentUserTax должен быть переопределен в наследнике');
    }
}