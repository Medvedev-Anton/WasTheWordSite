export class TaxesMapperInterface {
    constructor() {
        if (new.target === 'TaxesMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса TaxesMapperInterface');
        }
    }

    /**
     * Получает налог для пользователей
     * @param {string} name
     */
    getTaxByName(name) {
        throw new Error('getTaxByName должен быть переопределен в наследнике');
    }

    /**
     * Обновляет налог для пользователей
     * @param {string} name
     * @param {int} newTax
     */
    updateTaxByName(name, newTax) {
        throw new Error('updateTaxByName должен быть переопределен в наследнике');
    }
}