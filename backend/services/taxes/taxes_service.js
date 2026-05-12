import { TaxesServiceInterface } from "./taxes_service_interface.js";

export class TaxesService extends TaxesServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getUsersTax() {
        try {
            return this.mapper.getTaxByName('user');
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getOrgsTax() {
        try {
            return this.mapper.getTaxByName('org');
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateUsersTax(newTax) {
        try {
            return this.mapper.updateTaxByName('user', newTax);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateOrgsTax(newTax) {
        try {
            return this.mapper.updateTaxByName('org', newTax);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}