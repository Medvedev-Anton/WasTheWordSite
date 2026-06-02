import { TaxesMapperInterface } from "./taxes_mapper_interface.js";
import { db } from "../../database/init.js";

export class TaxesOrgsMapper extends TaxesMapperInterface {
    constructor() {
        super();
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

        return result ? result.tax : null;
    }

    nullifyTax(id) {
        db.prepare(`
            UPDATE
                orgs_tax
            SET
                tax = 0
            WHERE
                id = ?    
        `).run(id);
    }

    getAll() {
        const result = db.prepare(`
            SELECT
                id,
                orgId as entityId,
                tax
            FROM
                orgs_tax    
        `).all();

        return result;
    }
}