import { TaxesMapperInterface } from "./taxes_mapper_interface.js";
import { db } from "../../database/init.js";

export class TaxesOrgsMapper extends TaxesMapperInterface {
    constructor() {
        super();
    }

    getTaxPercent() {
        const result = db.prepare(`
            SELECT
                value
            FROM
                taxes
            WHERE
                name = 'org'
        `);

        return result.value || 0;
    }

    updateTaxPercent(newTax) {
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
                name = 'org'
        `).run(newTax);
    }

    incrementCurrentTax(orgId, incrementValue) {
        if (isNaN(parseInt(orgId))) {
            throw new Error('orgId должен быть числовым');
        }

        if (orgId < 0) {
            throw new Error('orgId должен быть больше нуля');
        }

        db.prepare(`
            UPDATE
                orgs_tax
            SET
                tax = tax + ?
            WHERE
                orgId = ?    
        `).run(incrementValue, orgId);
    }

    createCurrentTax(orgId, tax) {
        if (isNaN(parseInt(orgId))) {
            throw new Error('orgId должен быть числовым');
        }

        if (orgId < 0) {
            throw new Error('orgId должен быть больше нуля');
        }

        if (isNaN(parseInt(tax))) {
            throw new Error('tax должен быть числовым');
        }

        if (tax < 0) {
            throw new Error('tax должен быть больше нуля');
        }

        db.prepare(`
            INSERT INTO orgs_tax (orgId, tax)
            VALUES (?, ?)    
        `).run(orgId, tax);
    }

    getCurrentTax(orgId) {
        if (isNaN(parseInt(orgId))) {
            throw new Error('orgId должен быть числовым');
        }

        if (orgId < 0) {
            throw new Error('orgId должен быть больше нуля');
        }

        const result = db.prepare(`
            SELECT
                tax
            FROM
                orgs_tax
            WHERE
                orgId = ?
        `).get(orgId);

        return result.tax;
    }
}