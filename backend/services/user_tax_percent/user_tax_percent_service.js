import { UserTaxPercentServiceInterface } from "./user_tax_percent_service_interface.js";

export class UserTaxPercentService extends UserTaxPercentServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getTaxPercent() {
        try {
            return this.mapper.getTaxPercent();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateTaxPercent(newPercent) {
        try {
            return this.mapper.updateTaxPercent(newPercent);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}