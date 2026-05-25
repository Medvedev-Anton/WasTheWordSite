import { BankParamsServiceInterface } from "./bank_params_service_interface.js";

export class BankParamsService extends BankParamsServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getBankAllParams(bankId) {
        try {
            return this.mapper.getBankAllParams(bankId);
        }
        catch (e) {
            throw new Error(e);
        }
    }

    getBankEntityParams(bankId) {
        try {
            return this.mapper.getBankEntityParams(bankId);
        }
        catch (e) {
            throw new Error(e);
        }
    }

    createBankRowDefault(bankId) {
        try {
            return this.mapper.createBankRowDefault(bankId);
        }
        catch (e) {
            throw new Error(e);
        }
    }

    updateLoanPercent(bankId, newPercent) {
        try {
            return this.mapper.updateLoanPercent(bankId, newPercent);
        }
        catch (e) {
            throw new Error(e);
        }
    }

    updateLoanDuring(bankId, newDuringDays) {
        try {
            return this.mapper.updateLoanDuring(bankId, newDuringDays);
        }
        catch (e) {
            throw new Error(e);
        }
    }
}