import { PricesMapperInterace } from "./prices_mapper_interface.js";
import { db } from "../../database/init.js";

export class PricesMapper extends PricesMapperInterace {
    constructor() {
        super();
    }

    getPriceByName(name) {
        const result = db.prepare(`
            SELECT
                value
            FROM
                action_prices
            WHERE
                name = ?    
        `).get(name);

        return result.value || 0;
    }

    updatePriceByName(name, newPrice) {
        if (isNaN(parseInt(newPrice))) {
            throw new Error('newTax должен быть числовым');
        }

        if (newPrice < 0) {
            throw new Error('newTax должен быть больше нуля');
        }

        db.prepare(`
            UPDATE
                action_prices
            SET
                value = ?
            WHERE
                name = ?
        `).run(newPrice, name);
    }
}