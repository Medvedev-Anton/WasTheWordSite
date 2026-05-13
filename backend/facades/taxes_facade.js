import { TaxesMapper } from "../mappers/taxes/taxes_mapper.js";
import { TaxesService } from "../services/taxes/taxes_service.js";

export class TaxesFacade {
    static getService() {
        return new TaxesService(
            new TaxesMapper()
        );
    }

    /**
     * Получить налог для пользователей
     */
    getUsersTaxPercent() {
        try {
            return this.getService().getUsersTaxPercent();
        }
        catch (e) {
            throw new Error(e.message);
        } 
    }

    /**
     * Получить налог для организаций
     */
    getOrgsTaxPercent() {
        try {
            return this.getService().getOrgsTaxPercent();
        }
        catch (e) {
            throw new Error(e.message);
        } 
    }

    /**
     * Обновляет налог пользователей
     * @param {int} newTax 
     */
    updateUsersTaxPercent(newTax) {
        try {
            return this.getService().updateUsersTaxPercent(newTax);
        }
        catch (e) {
            throw new Error(e.message);
        } 
    }

    /**
     * Обновляет налог организаций
     * @param {int} newTax
     */
    updateOrgsTaxPercent(newTax) {
        try {
            return this.getService().updateOrgsTaxPercent(newTax);
        }
        catch (e) {
            throw new Error(e.message);
        } 
    }
}