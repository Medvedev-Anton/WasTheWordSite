import { UserTaxPercentMapper } from "../mappers/user_tax_percent/user_tax_percent_mapper.js";
import { UserTaxPercentService } from "../services/user_tax_percent/user_tax_percent_service.js";

export class UserTaxPercentFacade {
    static getService () {
        if (this.service === null || this.service === undefined) {
            this.service = new UserTaxPercentService(
                new UserTaxPercentMapper()
            );
        }

        return this.service;
    }

    /**
     * Получает процент налога пользователя
     * @return {number}
     */
    static getTaxPercent() {
        try {
            return this.getService().getTaxPercent();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновляет процент налога для типа организации
     * @param {number} newPercent
     */
    static updateTaxPercent(newPercent) {
        try {
            return this.getService().updateTaxPercent(newPercent);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}