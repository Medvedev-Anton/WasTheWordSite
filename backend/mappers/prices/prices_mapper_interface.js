export class PricesMapperInterace {
    constructor() {
        if (new.target === 'PricesMapperInterace') {
            throw new Error('Нельзя создать экземлпяр класса PricesMapperInterace');
        }
    }

    /**
     * Получить цену по имени
     * @param {string} name
     */
    getPriceByName(name) {
        throw new Error('getPriceByName должен быть переопределен в наследнике');
    }

    /**
     * Обновить цену по имени
     * @param {string} name
     * @param {int} newPrice
     */
    updatePriceByName(name, newPrice) {
        throw new Error('updatePriceByName должен быть переопределен в наследнике');
    }
}