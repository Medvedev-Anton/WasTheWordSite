import FarmsResourcesMapperInterface from "./farms_resources_mapper_interface.js";
import { db } from "../../database/init.js";

export default class FarmsResourcesMapper extends FarmsResourcesMapperInterface {
    constructor() {
        super();
    }

    create(farmId, resourceId) {
        db.prepare(`
            INSERT INTO
                farms_resources (farmId, resourceId)
            VALUES (?, ?)
        `).run(farmId, resourceId);
    }

    findByFarmId(farmId) {
        const result = db.prepare(`
            SELECT
                r.*
            FROM
                farm_resources f
            JOIN
                resources r
            ON
                r.id = f.resourceId
            WHERE
                f.farmId = ?    
        `).get(farmId);
    }
}