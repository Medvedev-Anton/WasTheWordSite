import { OrgTaxPercentMapperInterface } from "./org_tax_percent_mapper_interface.js";
import { db } from "../../database/init.js";

export class OrgTaxPercentMapper extends OrgTaxPercentMapperInterface {
    constructor() {
        super();
    }

    getAllTaxes() {
        const result = db.prepare(`
            SELECT
                *
            FROM 
                orgs_tax_percent
        `);

        return result;
    }

    getTaxPercent(orgType) {
        const result = db.prepare(`
            SELECT
                percent
            FROM 
                orgs_tax_percent
            WHERE
                orgType = ?    
        `).get(orgType);

        return result.percent || 0;
    }

    updateTaxPercent(orgType, newPercent) {
        db.prepare(`
            UPDATE
                orgs_tax_percent
            SET
                percent = ?
            WHERE
                orgType = ?
        `).run(newPercent, orgType);
    }
}