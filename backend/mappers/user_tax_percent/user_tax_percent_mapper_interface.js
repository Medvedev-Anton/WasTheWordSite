export class UserTaxPercentMapperInterface {
    constructor() {
        if (new.target === 'UserTaxPercentMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса UserTaxPercentMapperInterface');
        }
    }

    /**
     * Получает процент налога пользователя
     * @return {number}
     */
    getTaxPercent() {
        throw new Error('getTaxPercent должен быть переопределен в наследнике');
    }

    /**
     * Обновляет процент налога для типа организации
     * @param {number} newPercent
     */
    updateTaxPercent(newPercent) {
        throw new Error('updateTaxPercent должен быть переопределен в наследнике');
    }
}