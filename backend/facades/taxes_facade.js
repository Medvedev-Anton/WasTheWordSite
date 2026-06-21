import { TaxesOrgsMapper } from "../mappers/taxes/taxes_orgs_mapper.js";
import { TaxesUsersMapper } from "../mappers/taxes/taxes_users_mapper.js";
import { TaxesService } from "../services/taxes/taxes_service.js";
import { db } from "../database/init.js";
import { BalanceFacade } from "./balance_facade.js";
import { OrgsFacade } from "./orgs_facade.js";

export class TaxesFacade {
    constructor(entity) {
        this.entity = entity;

        if (entity === 'users') {
            this.service = new TaxesService(
                new TaxesUsersMapper()
            );
        }
        else if (entity === 'orgs') {
            this.service = new TaxesService(
                new TaxesOrgsMapper()
            );
        }
        else {
            throw new Error('Неизвестная сущность для работы с налогами: ' + entity);
        }
    }

    static entity(entity) {
        return new this(entity);
    }

    /**
     * Списывает все платежи по налогам у конкретной сущности
     */
    payTax() {
        const transaction = db.transaction(() => {
            try {
                const taxes = this.service.getAll();

                taxes.forEach(tax => {
                    this.service.nullifyTax(tax.id);
                    BalanceFacade.entity(this.entity).decrement(tax.entityId, tax.tax);

                    const goverId = OrgsFacade.getAllOrgsByType('Правительственная')[0] ?
                                    OrgsFacade.getAllOrgsByType('Правительственная')[0].id :
                                    null;

                    if (goverId != null) {
                        BalanceFacade.entity('orgs').increment(goverId, tax.tax);
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });

        try {
            transaction();
        }
        catch (e) {
            throw new Error('Ошибка при обработке транзакции по оплате налогов: ' + e.message);
        }
    }

    /**
     * Списывает платежи по налогам у всех сущностей
     */
    static payAllTaxes() {
        const transaction = db.transaction(() => {
            try {
                TaxesFacade.entity('users').payTax();
                TaxesFacade.entity('orgs').payTax();
            }
            catch (e) {
                throw new Error(e.message);
            }
        });

        try {
            transaction()
        }
        catch (e) {
            throw new Error('Ошибка при обработке транзакции списания всех налогов: ' + e.message);
        }
    }
}