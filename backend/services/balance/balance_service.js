import { BalanceServiceInterface } from "./balance_service_interface.js";

export class BalanceService extends BalanceServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    increment(entityId, incrementValue) {
        try {
            return this.mapper.increment(entityId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    decrement(entityId, decrementValue) {
        try {
            return this.mapper.decrement(entityId, decrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getBalance(entityId) {
        try {
            return this.mapper.getBalance(entityId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}