import { BalanceOrgsMapper } from "../mappers/balance/balance_orgs_mapper.js";
import { BalanceUsersMapper } from "../mappers/balance/balance_users_mapper.js";
import { ProfitOrgsMapper } from "../mappers/profit/profit_orgs_mapper.js";
import { ProfitUsersMapper } from "../mappers/profit/profit_users_mapper.js";
import { TaxesOrgsMapper } from "../mappers/taxes/taxes_orgs_mapper.js";
import { TaxesUsersMapper } from "../mappers/taxes/taxes_users_mapper.js";
import { BalanceService } from "../services/balance/balance_service.js";
import { ProfitService } from "../services/profit/profit_service.js";
import { TaxesService } from "../services/taxes/taxes_service.js";

export class ProfitFacade {
    constructor(entity) {
        if (entity === 'users') {
            this.profitService = new ProfitService(
                new ProfitUsersMapper()
            );

            this.taxService = new TaxesService(
                new TaxesUsersMapper()
            );

            this.balanceService = new BalanceService(
                new BalanceUsersMapper()
            );
        }
        else if (entity === 'orgs') {
            this.profitService = new ProfitService(
                new ProfitOrgsMapper()
            );

            this.taxService = new TaxesService(
                new TaxesOrgsMapper()
            ); 

            this.balanceService = new BalanceService(
                new BalanceOrgsMapper()
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

    /**
     * Обрабатывает поступление\списание
     * @param {int} entityId
     * @param {int} incomingSum
     */
    processWithTax(entityId, incomingSum) {
        try {
            this.balanceService.increment(entityId, incomingSum);
            this.profitService.create(entityId, incomingSum);

            const taxPercent = this.taxService.getTaxPercent();
            const taxValue = this.taxService.calcTaxByIncome(incomingSum, taxPercent);

            if (taxValue !== 0) {
                this.taxService.incrementOrCreateCurrentTax(entityId, taxValue);
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}