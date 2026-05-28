import { BanksLoansBalanceServiceInterface } from "./banks_loans_balance_service_interface.js";

export class BanksLoansBalanceService extends BanksLoansBalanceServiceInterface {
    constructor(mapper) {
        super(mapper);
    }   

    create(bankId, balance) {
        try {
            return this.mapper.create(bankId, balance);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    increment(bankId, incrementValue) {
        try {
            return this.mapper.increment(bankId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    decrement(bankId, decrementValue) {
        try {
            return this.mapper.decrement(bankId, decrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getBalance(bankId) {
        try {
            return this.mapper.getBalance(bankId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}