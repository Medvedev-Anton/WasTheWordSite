import { OrgCreationPriceMapper } from "../mappers/org_creation_price/org_creation_price_mapper.js";
import { OrgCreationPriceService } from "../services/org_creation_price/org_creation_price_service.js";

export class OrgCreationPriceFacade {
    static getService() {
        return new OrgCreationPriceService(
            new OrgCreationPriceMapper()
        );
    }

    /**
     * Возвращает цены создания всех организаций сразу
     */
    static getAllPrices() {
        try {
            return this.getService().getAllPrices();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает цену создания организации
     * @param {string} orgType
     * @return {number}
     */
    static getOrgPrice(orgType) {
        try {
            return this.getService().getOrgPrice(orgType);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновляет цену создания организации
     * @param {string} orgType
     * @param {number} newPrice
     */
    static updateOrgPrice(orgType, newPrice) {
        try {
            return this.getService().updateOrgPrice(orgType, newPrice)
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}