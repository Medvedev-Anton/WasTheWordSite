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
     * Расчитывает величину налога с поступления
     * @param {int} income
     * @param {int} taxPercent
     * @return {int}
     */
    calcTaxByIncome(income, taxPercent) {
        throw new Error('calcTaxByIncome должен быть переопределен в наследнике');
    }

    /**
     * Получает процент налога
     * @return {int}
     */
    getTaxPercent() {
        throw new Error('getTaxPercent должен быть переопределен в наследнике');
    }

    /**
     * Обновляет процент налога сущности
     * @param {int} newTax
     */
    updateTaxPercent(newTax) {
        throw new Error('updateTaxPercent должен быть переопределен в наследнике');
    }

    /**
     * Увеличивает текущую сумму налога
     * @param {int} entityId
     * @param {int} incrementValue
     */
    incrementCurrentTax(entityId, incrementValue) {
        throw new Error('incrementCurrentTax должен быть переопределен в наследнике');
    }

    /**
     * Создает запись о сумме налога
     * @param {int} entityId
     * @param {int} tax
     */
    createCurrentTax(entityId, tax) {
        throw new Error('createCurrentTax должен быть переопределен в наследнике');
    }

    /**
     * Получает текущее значение налога
     * @param {int} entityId
     * @return {int}
     */
    getCurrentTax(entityId) {
        throw new Error('getCurrentTax должен быть переопределен в наследнике');
    }

    /**
     * Увеличивает/создает текущую сумму налога
     * @param {int} entityId
     * @param {int} incrementValue
     */
    incrementOrCreateCurrentTax(entityId, incrementValue) {
        throw new Error('incrementOrCreateCurrentTax должен быть переопределен в наследнике');
    }
}