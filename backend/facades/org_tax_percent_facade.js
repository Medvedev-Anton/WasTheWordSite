import { OrgTaxPercentMapper } from "../mappers/org_tax_percent/org_tax_percent_mapper.js";
import { OrgTaxPercentService } from "../services/org_tax_percent/org_tax_percent_service.js";

export class OrgTaxPercentFacade {
    static getService() {
        if (this.service === null || this.service === undefined) {
            this.service = new OrgTaxPercentService(
                new OrgTaxPercentMapper()
            );
        }

        return this.service;
    }

    /**
     * Получает процент налога для типа организации
     * @param {string} orgType
     * @return {number}
     */
    static getTaxPercent(orgType) {
        try {
            return this.getService().getTaxPercent(orgType);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновляет процент налога для типа организации
     * @param {string} orgType
     * @param {number} newPercent
     */
    static updateTaxPercent(orgType, newPercent) {
        try {
            return this.getService().updateTaxPercent(orgType, newPercent);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}