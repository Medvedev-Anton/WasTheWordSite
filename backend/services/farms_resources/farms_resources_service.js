import FarmsResourcesServiceInterface from "./farms_resources_service_interface.js";

export default class FarmsResourcesService extends FarmsResourcesServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    create(farmId, resourceId) {
        try {
            return this.mapper.create(farmId, resourceId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getByFarmId(farmId) {
        try {
            return this.mapper.findByFarmId(farmId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}