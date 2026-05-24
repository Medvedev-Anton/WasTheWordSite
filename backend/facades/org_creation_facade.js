import { OrgCreationMapper } from "../mappers/org_creation/org_creation_mapper.js";
import { OrgCreationService } from "../services/org_creation/org_creation_service.js";

export class OrgCreationFacade {
    static getService() {
        return new OrgCreationService(
            new OrgCreationMapper()
        );
    }

    /**
     * Возвращает цены создания всех организаций сразу
     */
    getAllPrices() {
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
    getOrgPrice(orgType) {
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
    updateOrgPrice(orgType, newPrice) {
        try {
            return this.getService().updateOrgPrice(orgType, newPrice)
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}