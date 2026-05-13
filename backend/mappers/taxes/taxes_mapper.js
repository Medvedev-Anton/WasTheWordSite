import { TaxesMapperInterface } from "./taxes_mapper_interface.js";
import { db } from "../../database/init.js";

export class TaxesMapper extends TaxesMapperInterface {
    constructor() {
        super();
    }

    getTaxPercentByName(name) {
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

    updateTaxPercentByName(name, newTax) {
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

    incrementCurrentUserTax(userId, incrementValue) {
        if (isNaN(parseInt(userId))) {
            throw new Error('userId должен быть числовым');
        }

        if (userId < 0) {
            throw new Error('userId должен быть больше нуля');
        }

        db.prepare(`
            UPDATE
                users_tax
            SET
                tax = tax + ?
            WHERE
                userId = ?    
        `).run(incrementValue, userId);
    }

    incrementCurrentOrgTax(orgId, incrementValue) {
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

    createCurrentUserTax(userId, tax) {
        if (isNaN(parseInt(userId))) {
            throw new Error('userId должен быть числовым');
        }

        if (userId < 0) {
            throw new Error('userId должен быть больше нуля');
        }

        if (isNaN(parseInt(tax))) {
            throw new Error('tax должен быть числовым');
        }

        if (tax < 0) {
            throw new Error('tax должен быть больше нуля');
        }

        db.prepare(`
            INSERT INTO users_tax (userId, tax)
            VALUES (?, ?)    
        `).run(userId, tax);
    }

    createCurrentOrgTax(orgId, tax) {
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
}