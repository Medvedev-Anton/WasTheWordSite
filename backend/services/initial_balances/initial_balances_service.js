import { InitialBalancesServiceInterface } from "./initial_balances_service_interface.js";

export class InitialBalancesService extends InitialBalancesServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getUserInitialBalance() {
        return this.mapper.getBalanceByName('user');
    }

    getOrgInitialBalance() {
        return this.mapper.getBalanceByName('org');
    }

    updateUserInitialBalance(newBalance) {
        try {
            return this.mapper.updateBalanceByName('user', newBalance);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateOrgInitialBalance(newBalance) {
        try {
            return this.mapper.updateBalanceByName('org', newBalance);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}