import { BalanceOrgsMapper } from "../mappers/balance/balance_orgs_mapper.js";
import { BalanceUsersMapper } from "../mappers/balance/balance_users_mapper.js";
import { BalanceService } from "../services/balance/balance_service.js";

export class BalanceFacade {
    constructor(entity) {
        if (entity === 'users') {
            this.service = new BalanceService(
                new BalanceUsersMapper()
            );
        }
        else if (entity === 'orgs') {
            this.service = new BalanceService(
                new BalanceOrgsMapper()
            );
        }
        else {
            throw new Error('Неизвестная сущность для работы с балансом: ' + entity);
        }
    }

    static entity(entity) {
        return new this(entity);
    }

    /**
     * Увеличивает баланс сущности
     * @param {int} entityId
     * @param {int} incrementValue
     */
    increment(entityId, incrementValue) {
        try {
            return this.service.increment(entityId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}