import { TaxesOrgsMapper } from "../mappers/taxes/taxes_orgs_mapper.js";
import { TaxesUsersMapper } from "../mappers/taxes/taxes_users_mapper.js";
import { TaxesService } from "../services/taxes/taxes_service.js";

export class TaxesFacade {
    constructor(entity) {
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
     * Получить налог для пользователей
     */
    getTaxPercent() {
        try {
            return this.service.getTaxPercent();
        }
        catch (e) {
            throw new Error(e.message);
        } 
    }

    /**
     * Обновляет налог пользователей
     * @param {int} newTax 
     */
    updateTaxPercent(newTax) {
        try {
            return this.service.updateTaxPercent(newTax);
        }
        catch (e) {
            throw new Error(e.message);
        } 
    }
}