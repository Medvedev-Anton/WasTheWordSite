import OrgsSimpleItemsMapperInterface from "./orgs_simple_items_mapper_interface.js";
import { db } from "../../database/init.js";

export default class OrgsSimpleItemsMapper extends OrgsSimpleItemsMapperInterface {
    constructor() {
        super();
    }

    create(orgId, simpleItemId, count) {
        db.prepare(`
            INSERT INTO
                orgs_simple_items(orgId, simpleItemId, count)
            VALUES (?, ?, ?)
        `).run(orgId, simpleItemId, count);
    }

    delete(id) {
        db.prepare(`
            DELETE FROM
                orgs_simple_items
            WHERE
                id = ?  
        `).run(id);
    }

    findById(id) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                orgs_simple_items
            WHERE
                id = ?    
        `).get(id);

        return result || null;
    }

    findAllByOrgId(orgId) {
        const result = db.prepare(`
            SELECT
                i.*,
                o.count as count,
                o.price as price
            FROM
                orgs_simple_items o
            JOIN
                simple_items i
            ON
                i.id = o.simpleItemId
            WHERE
                o.orgId = ?     
        `).all(orgId);

        return result;
    }

    findByOrgAndSimpleItem(orgId, simpleItemId) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                orgs_simple_items
            WHERE
                orgId = ?
                AND
                simpleItemId = ?     
        `).get(orgId, simpleItemId);

        return result || null;
    }

    increment(id, incrementValue) {
        db.prepare(`
            UPDATE
                orgs_simple_items
            SET
                count = count + ?
            WHERE
                id = ?      
        `).run(incrementValue, id);
    }

    decrement(id, decrementValue) {
        db.prepare(`
            UPDATE
                orgs_simple_items
            SET
                count = count - ?
            WHERE
                id = ?      
        `).run(decrementValue, id);
    }

    findCountByOrgAndSimpleItem(orgId, simpleItemId) {
        const result = db.prepare(`
            SELECT
                count
            FROM
                orgs_simple_items
            WHERE
                orgId = ?
                AND
                simpleItemId = ?
        `).get(orgId, simpleItemId);

        if (result === undefined || result === null) {
            return 0;
        }

        const count = parseInt(result.count);

        if (isNaN(count)) {
            return 0;
        }

        return count;
    }

    updatePriceByOrgAndSimpleItem(orgId, simpleItemId, newPrice) {
        db.prepare(`
            UPDATE
                orgs_simple_items
            SET
                newPrice = ?
            WHERE
                orgId = ?
                AND
                simpleItemId = ?
        `).run(newPrice, orgId, simpleItemId);
    }
}