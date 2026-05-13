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
}