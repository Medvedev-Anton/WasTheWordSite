import { OrgCreationMapperInterface } from "./org_creation_mapper_interface.js";
import { db } from "../../database/init.js";

export class OrgCreationMapper extends OrgCreationMapperInterface {
    constructor() {
        super();
    }

    findAll() {
        const result = db.prepare(`
            SELECT
                *
            FROM
                orgs_creation_prices
        `).all();

        return Object.fromEntries(result.map(row => [row.orgType, row.price]));
    }

    findByOrgType(orgType) {
        const result = db.prepare(`
            SELECT
                percent
            FROM
                orgs_creation_prices
            WHERE
                orgType = ?
        `).get(orgType);

        return result.percent || 0;
    }

    updateByOrgType(orgType, newPrice) {
        db.prepare(`
            UPDATE
                orgs_creation_prices
            SET
                price = ?
            WHERE
                orgType = ?
        `).run(newPrice, orgType);
    }
}