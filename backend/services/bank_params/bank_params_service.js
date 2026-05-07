import { BankParamsServiceInterface } from "./bank_params_service_interface.js";

export class BankParamsService extends BankParamsServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getBankParams(bankId) {
        try {
            return this.mapper.getBankParams(bankId);
        }
        catch (e) {
            throw new Error(e);
        }
    }

    updateUserPercent(bankId, newPercent) {
        try {
            return this.mapper.updateUserPercent(bankId, newPercent);
        }
        catch (e) {
            throw new Error(e);
        }
    }

    updateUserDuring(bankId, newDuringDays) {
        try {
            return this.mapper.updateUserDuring(bankId, newDuringDays);
        }
        catch (e) {
            throw new Error(e);
        }
    }

    updateOrgPercent(bankId, newPercent) {
        try {
            return this.mapper.updateOrgPercent(bankId, newPercent);
        }
        catch (e) {
            throw new Error(e);
        }
    }

    updateOrgDuring(bankId, newDuringDays) {
        try {
            return this.mapper.updateOrgDuring(bankId, newDuringDays);
        }
        catch (e) {
            throw new Error(e);
        }
    }
}