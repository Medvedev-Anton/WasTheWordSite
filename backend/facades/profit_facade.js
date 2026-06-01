import { BalanceOrgsMapper } from "../mappers/balance/balance_orgs_mapper.js";
import { BalanceUsersMapper } from "../mappers/balance/balance_users_mapper.js";
import { ProfitOrgsMapper } from "../mappers/profit/profit_orgs_mapper.js";
import { ProfitUsersMapper } from "../mappers/profit/profit_users_mapper.js";
import { TaxesOrgsMapper } from "../mappers/taxes/taxes_orgs_mapper.js";
import { TaxesUsersMapper } from "../mappers/taxes/taxes_users_mapper.js";
import { BalanceService } from "../services/balance/balance_service.js";
import { ProfitService } from "../services/profit/profit_service.js";
import { TaxesService } from "../services/taxes/taxes_service.js";
import { db } from "../database/init.js";
import { UserTaxPercentMapper } from "../mappers/user_tax_percent/user_tax_percent_mapper.js";
import { OrgTaxPercentAdapter } from "../adapters/org_tax_percent_adapter.js";
import { OrgTaxPercentMapper } from "../mappers/org_tax_percent/org_tax_percent_mapper.js";
import { OrgsFacade } from "./orgs_facade.js";
import NotificationsFacade from "./notifications_facade.js";

export class ProfitFacade {
    constructor(entity) {
        this.entity = entity;
        if (entity === 'users') {
            this.profitService = new ProfitService(
                new ProfitUsersMapper()
            );

            this.taxService = new TaxesService(
                new TaxesUsersMapper()
            );

            this.taxPercentMapper = new UserTaxPercentMapper();

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
        return new this(entity);
    }

    orgType(orgType) {
        this.taxPercentMapper = new OrgTaxPercentAdapter(
            new OrgTaxPercentMapper(),
            orgType
        );

        return this;
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
        const transaction = db.transaction(() => {
            try {
                this.balanceService.increment(entityId, incomingSum);
                this.profitService.create(entityId, incomingSum);

                const taxPercent = this.taxPercentMapper.getTaxPercent();
                const taxValue = this.taxService.calcTaxByIncome(incomingSum, taxPercent);

                if (taxValue !== 0) {
                    this.taxService.incrementOrCreateCurrentTax(entityId, taxValue);
                }

                if (this.entity === 'orgs') {
                    const adminId = OrgsFacade.getAdminId(entityId);
                    NotificationsFacade.create(adminId, `Ваша организация получила доход в размере: ${incomingSum / 100}$`);
                }
            }
            catch (e) {
                throw new Error(e.message);
            }
        });

        try {
            transaction();
        }
        catch (e) {
            throw new Error('ошибка выполнения транзакции по обработке поступления: ' + e);
        }
    }
}