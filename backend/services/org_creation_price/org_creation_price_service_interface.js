import { OrgCreationPriceMapperInterface } from "../../mappers/org_creation_price/org_creation_price_mapper_interface.js";

export class OrgCreationPriceServiceInterface {
    /**
     * @param {OrgCreationPriceMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'OrgCreationPriceServiceInterface') {
            throw new Error('нельзя создать экземпляр класса OrgCreationPriceServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Возвращает цены создания всех организаций сразу
     */
    getAllPrices() {
        throw new Error('getAllPrices должен быть переопределен в наследнике');
    }

    /**
     * Возвращает цену создания организации
     * @param {string} orgType
     * @return {number}
     */
    getOrgPrice(orgType) {
        throw new Error('getOrgPrice должен быть переопределен в наследнике');
    }

    /**
     * Обновляет цену создания организации
     * @param {string} orgType
     * @param {number} newPrice
     */
    updateOrgPrice(orgType, newPrice) {
        throw new Error('updateOrgPrice должен быть переопределен в наследнике');
    }
}