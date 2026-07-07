import FarmsResourcesMapper from "../mappers/farms_resources/farms_resources_mapper.js";
import FarmsResourcesService from "../services/farms_resources/farms_resources_service.js";

export default class FarmsResourcesFacade {
    static getService() {
        return new FarmsResourcesService(
            new FarmsResourcesMapper()
        )
    }

    /**
     * Создание записи
     * @param {number} farmId
     * @param {number} resourceId
     */
    static create(farmId, resourceId) {
        try {
            return this.getService().create(farmId, resourceId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}