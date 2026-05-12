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
    getUsersTax() {
        try {
            return this.getService().getUsersTax();
        }
        catch (e) {
            throw new Error(e.message);
        } 
    }

    /**
     * Получить налог для организаций
     */
    getOrgsTax() {
        try {
            return this.getService().getOrgsTax();
        }
        catch (e) {
            throw new Error(e.message);
        } 
    }

    /**
     * Обновляет налог пользователей
     * @param {int} newTax 
     */
    updateUsersTax(newTax) {
        try {
            return this.getService().updateUsersTax(newTax);
        }
        catch (e) {
            throw new Error(e.message);
        } 
    }

    /**
     * Обновляет налог организаций
     * @param {int} newTax
     */
    updateOrgsTax(newTax) {
        try {
            return this.getService().updateOrgsTax(newTax);
        }
        catch (e) {
            throw new Error(e.message);
        } 
    }
}