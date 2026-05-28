import { TaxesMapperInterface } from "./taxes_mapper_interface.js";
import { db } from "../../database/init.js";

export class TaxesUsersMapper extends TaxesMapperInterface {
    constructor() {
        super();
    }

    incrementCurrentTax(userId, incrementValue) {
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

    createCurrentTax(userId, tax) {
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

    getCurrentTax(userId) {
        if (isNaN(parseInt(userId))) {
            throw new Error('userId должен быть числовым');
        }

        if (userId < 0) {
            throw new Error('userId должен быть больше нуля');
        }

        const result = db.prepare(`
            SELECT
                tax
            FROM
                users_tax
            WHERE
                userId = ?
        `).get(userId);

        return result ? result.tax : null;
    }

    nullifyTax(id) {
        db.prepare(`
            UPDATE
                users_tax
            SET
                tax = 0
            WHERE
                id = ?    
        `).run(id);
    }

    getAll() {
        const result = db.prepare(`
            SELECT
                *
            FROM
                users_tax    
        `).all();

        return result;
    }
}