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
     * Списывает все платежи по налогам
     */
    payTax() {
        const transaction = db.transaction(() => {
            const taxes = this.service.getAll();

            taxes.forEach(tax => {
                this.service.nullifyTax(tax.id);
                BalanceFacade.entity(this.entity).decrement(tax.id, tax.tax);

                const goverId = OrgsFacade.getAllOrgsIdsByType('Правительственная')[0];

                if (goverId != undefined) {
                    BalanceFacade.entity('orgs').increment(goverId, tax.tax);
                }
            });
        });

        try {
            transaction();
        }
        catch (e) {
            throw new Error('Ошибка при обработке транзакции по оплате налогов' + e.message);
        }
    }
}