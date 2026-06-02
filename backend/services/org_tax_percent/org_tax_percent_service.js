import { OrgTaxPercentServiceInterface } from "./org_tax_percent_service_interface.js";

export class OrgTaxPercentService extends OrgTaxPercentServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getAllTaxes() {
        try {
            return this.mapper.getAllTaxes();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getTaxPercent(orgType) {
        try {
            return this.mapper.getTaxPercent(orgType);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateTaxPercent(orgType, newPercent) {
        try {
            return this.mapper.updateTaxPercent(orgType, newPercent);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}