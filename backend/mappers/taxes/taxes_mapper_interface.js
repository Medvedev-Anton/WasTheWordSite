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
}