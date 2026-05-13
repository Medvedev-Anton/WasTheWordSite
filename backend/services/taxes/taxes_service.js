import { TaxesServiceInterface } from "./taxes_service_interface.js";

export class TaxesService extends TaxesServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getUsersTaxPercent() {
        try {
            return this.mapper.getTaxPercentByName('user');
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getOrgsTaxPercent() {
        try {
            return this.mapper.getTaxPercentByName('org');
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateUsersTaxPercent(newTax) {
        try {
            return this.mapper.updateTaxPercentByName('user', newTax);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateOrgsTaxPercent(newTax) {
        try {
            return this.mapper.updateTaxPercentByName('org', newTax);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    calcTaxByIncome(income, taxPercent) {
        return income / 100 * taxPercent;
    }

    incrementCurrentUserTax(userId, incrementValue) {
        try {
            return this.mapper.incrementCurrentUserTax(userId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    incrementCurrentOrgTax(orgId, incrementValue) {
        try {
            return this.mapper.incrementCurrentOrgTax(orgId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}