import FarmsResourcesMapperInterface from "./farms_resources_mapper_interface.js";
import { db } from "../../database/init.js";

export default class FarmsResourcesMapper extends FarmsResourcesMapperInterface {
    constructor() {
        super();
    }

    create(farmId, resourceId) {
        db.prepare(`
            INSERT INTO
                farms_resources
            VALUES (farmId, resourceId)
        `).run(farmId, resourceId);
    }
}