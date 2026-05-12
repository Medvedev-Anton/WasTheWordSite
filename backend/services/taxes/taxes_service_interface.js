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
    getUsersTax() {
        throw new Error('getUsersTax должен быть переопределен в наследнике');
    }

    /**
     * Получить налог для организаций
     */
    getOrgsTax() {
        throw new Error('getOrgsTax должен быть переопределен в наследнике');
    }

    /**
     * Обновляет налог пользователей
     * @param {int} newTax 
     */
    updateUsersTax(newTax) {
        throw new Error('updateUsersTax должен быть переопределен в наследнике');
    }

    /**
     * Обновляет налог организаций
     * @param {int} newTax
     */
    updateOrgsTax(newTax) {
        throw new Error('updateOrgsTax должен быть переопределен в наследнике');
    }
}