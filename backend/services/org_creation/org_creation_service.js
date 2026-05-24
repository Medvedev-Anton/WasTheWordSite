import { OrgCreationServiceInterface } from "./org_creation_service_interface.js";

export class OrgCreationService extends OrgCreationServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getAllPrices() {
        try {
            return this.mapper.findAll();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getOrgPrice(orgType) {
        try {
            return this.mapper.findByOrgType(orgType);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateOrgPrice(orgType, newPrice) {
        try {
            return this.mapper.updateByOrgType(orgType, newPrice)
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}