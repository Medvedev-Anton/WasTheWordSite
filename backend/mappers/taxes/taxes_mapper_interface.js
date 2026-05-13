export class TaxesMapperInterface {
    constructor() {
        if (new.target === 'TaxesMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса TaxesMapperInterface');
        }
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
}