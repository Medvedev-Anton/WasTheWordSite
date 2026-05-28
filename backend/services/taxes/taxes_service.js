import { TaxesServiceInterface } from "./taxes_service_interface.js";

export class TaxesService extends TaxesServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    calcTaxByIncome(income, taxPercent) {
        if (taxPercent === 0) {
            return 0;
        }

        return income / 100 * taxPercent;
    }

    incrementCurrentTax(entityId, incrementValue) {
        try {
            return this.mapper.incrementCurrentTax(entityId, incrementValue)
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    incrementOrCreateCurrentTax(entityId, incrementValue) {
        try {
            const userTax = this.mapper.getCurrentTax(entityId);

            if (userTax == null) {
                return this.mapper.createCurrentTax(entityId, incrementValue);
            }
            else {
                return this.mapper.incrementCurrentTax(entityId, incrementValue);
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    createCurrentTax(entityId, tax) {
        try {
            return this.mapper.createCurrentTax(entityId, tax);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getCurrentTax(entityId) {
        try {
            return this.mapper.getCurrentTax(entityId) || 0;
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    nullifyTax(id) {
        try {
            return this.mapper.nullifyTax(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getAll() {
        try {
            return this.mapper.getAll();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}