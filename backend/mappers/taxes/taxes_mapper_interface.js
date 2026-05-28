export class TaxesMapperInterface {
    constructor() {
        if (new.target === 'TaxesMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса TaxesMapperInterface');
        }
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
     * Зануляет текущее значение налога
     * @param {int} entityId
     */
    nullifyTax(id) {
        throw new Error('nullifyTax должен быть переопределен в наследнике');
    }

    /**
     * Возвращает все записи налогов
     */
    getAll() {
        throw new Error('getAll должен быть переопределен в наследнике');
    }
}