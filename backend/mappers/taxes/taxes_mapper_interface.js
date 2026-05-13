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
    getTaxPercentByName(name) {
        throw new Error('getTaxPercentByName должен быть переопределен в наследнике');
    }

    /**
     * Обновляет налог для пользователей
     * @param {string} name
     * @param {int} newTax
     */
    updateTaxPercentByName(name, newTax) {
        throw new Error('updateTaxPercentByName должен быть переопределен в наследнике');
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
}