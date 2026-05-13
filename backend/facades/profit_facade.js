import { ProfitOrgsMapper } from "../mappers/profit/profit_orgs_mapper.js";
import { ProfitUsersMapper } from "../mappers/profit/profit_users_mapper.js";
import { ProfitService } from "../services/profit/profit_service.js";

export class ProfitFacade {
    constructor(entity) {
        if (entity === 'users') {
            this.profitService = new ProfitService(
                new ProfitUsersMapper()
            );
        }
        else if (entity === 'orgs') {
            this.profitService = new ProfitService(
                new ProfitOrgsMapper()
            );
        }
        else {
            throw new Error('Неизвестная сущность для вычисления дохода: ' + entity);
        }
    }

    static entity(entity) {
        return new self(entity);
    }

    /**
     * Создает запись о доходе
     * @param {int} entityId
     * @param {int} incomingSum
     * @param {string} date
     * @return {int}
     */
    createProfit(entityId, incomingSum, date) {
        try {
            return this.profitService.create(entityId, incomingSum, date);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает сумму доходов сущности за указанный период
     * @param {int} entityId
     * @param {string} dateStart
     * @param {string} dateFinish
     * @return {int}
     */
    getSumInDateInterval(entityId, dateStart, dateFinish) {
        try {
            return this.profitService.getSumInDateInterval(entityId, dateStart, dateFinish);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}