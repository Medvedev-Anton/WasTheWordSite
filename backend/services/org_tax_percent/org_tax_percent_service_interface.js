import { OrgTaxPercentMapperInterface } from "../../mappers/org_tax_percent/org_tax_percent_mapper_interface.js";

export class OrgTaxPercentServiceInterface {
    /**
     * @param {OrgTaxPercentMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'OrgTaxPercentServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса OrgTaxPercentServiceInterface');
        }

        this.mapper = mapper;
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