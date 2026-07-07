import OrgsResourcesMapperInterface from "./orgs_resources_mapper_interface.js";
import { db } from "../../database/init.js";

export default class OrgsResourcesMapper extends OrgsResourcesMapperInterface {
    constructor() {
        super();
    }

    create(orgId, resourceId, count) {
        db.prepare(`
            INSERT INTO
                orgs_resources(orgId, resourceId, count)
            VALUES (?, ?, ?)
        `).run(orgId, resourceId, count);
    }

    delete(id) {
        db.prepare(`
            DELETE FROM
                orgs_resources
            WHERE
                id = ?  
        `).run(id);
    }

    findById(id) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                orgs_resources
            WHERE
                id = ?    
        `).get(id);

        return result || null;
    }

    findAllByOrgId(orgId) {
        const result = db.prepare(`
            SELECT
                r.*
            FROM
               orgs_resources o
            JOIN
                resources r
            ON
                r.id = o.resourceId
            WHERE
                o.orgId = ?     
        `).all(orgId);

        return result;
    }
}