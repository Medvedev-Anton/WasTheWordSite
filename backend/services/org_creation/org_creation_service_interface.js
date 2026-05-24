import { OrgCreationMapperInterface } from "../../mappers/org_creation/org_creation_mapper_interface.js";

export class OrgCreationServiceInterface {
    /**
     * @param {OrgCreationMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'OrgCreationServiceInterface') {
            throw new Error('нельзя создать экземпляр класса OrgCreationServiceInterface');
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