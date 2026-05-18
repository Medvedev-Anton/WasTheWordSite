import { UserTaxPercentMapperInterface } from "./user_tax_percent_mapper_interface.js";
import { db } from "../../database/init.js";

export class UserTaxPercentMapper extends UserTaxPercentMapperInterface {
    constructor() {
        super();
    }

    getTaxPercent() {
        const result = db.prepare(`
            SELECT
                value
            FROM
                taxes_percent
            WHERE
                name = 'user'
        `).get();

        return result.value || 0;
    }

    updateTaxPercent(newPercent) {
        db.prepare(`
            UPDATE
                taxes_percent
            SET
                value = ?
            WHERE
                name = 'user'
        `).run(newPercent);
    }
}