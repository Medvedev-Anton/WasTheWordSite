export class OrgCreationPriceMapperInterface {
    constructor() {
        if (new.target === 'OrgCreationPriceMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса OrgCreationPriceMapperInterface');
        }
    }

    /**
     * Возвращает цены создания всех организаций сразу
     */
    findAll() {
        throw new Error('findAll должен быть переопределен в наследнике');
    }

    /**
     * Возвращает цену создания организации
     * @param {string} orgType
     * @return {number}
     */
    findByOrgType(orgType) {
        throw new Error('findByOrgType должен быть переопределен в наследнике');
    }

    /**
     * Обновляет цену создания организации
     * @param {string} orgType
     * @param {number} newPrice
     */
    updateByOrgType(orgType, newPrice) {
        throw new Error('updateByOrgType должен быть переопределен в наследнике');
    }
}