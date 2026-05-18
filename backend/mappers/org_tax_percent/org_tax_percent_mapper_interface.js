export class OrgTaxPercentMapperInterface {
    constructor() { 
        if (new.target === 'OrgTaxPercentMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса OrgTaxPercentMapperInterface');
        }
    }

    /**
     * Получает процент налога для типа организации
     * @param {string} orgType
     * @return {number}
     */
    getTaxPercent(orgType) {
        throw new Error('getTaxPercent должен быть переопределен в наследнике');
    }

    /**
     * Обновляет процент налога для типа организации
     * @param {string} orgType
     * @param {number} newPercent
     */
    updateTaxPercent(orgType, newPercent) {
        throw new Error('updateTaxPercent должен быть переопределен в наследнике');
    }
}
