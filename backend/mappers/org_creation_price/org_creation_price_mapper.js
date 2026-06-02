import { OrgCreationPriceMapperInterface } from "./org_creation_price_mapper_interface.js";
import { db } from "../../database/init.js";

export class OrgCreationPriceMapper extends OrgCreationPriceMapperInterface {
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
                price
            FROM
                orgs_creation_prices
            WHERE
                orgType = ?
        `).get(orgType);

        if (result === undefined) {
            return 0;
        }

        const price = parseFloat(result.price || 0);

        if (isNaN(price)) {
            return 0;
        }

        return price;
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