import { TaxesMapperInterface } from "./taxes_mapper_interface.js";
import { db } from "../../database/init.js";

export class TaxesMapper extends TaxesMapperInterface {
    constructor() {
        super();
    }

    getTaxByName(name) {
        const result = db.prepare(`
            SELECT
                value
            FROM
                taxes
            WHERE
                name = ?
        `).get(name);

        return result.value || 0;
    }

    updateTaxByName(name, newTax) {
        if (isNaN(parseInt(newTax))) {
            throw new Error('newTax должен быть числовым');
        }

        if (newTax < 0) {
            throw new Error('newTax должен быть больше нуля');
        }

        const result = db.prepare(`
            UPDATE
                taxes
            SET
                value = ?
            WHERE
                name = ?
        `).run(newTax, name);
    }
}