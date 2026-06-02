import { UserTaxPercentMapperInterface } from "../../mappers/user_tax_percent/user_tax_percent_mapper_interface.js";

export class UserTaxPercentServiceInterface {
    /**
     * @param {UserTaxPercentMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'UserTaxPercentServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса UserTaxPercentServiceInterface');
        }

        this.mapper = mapper;
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