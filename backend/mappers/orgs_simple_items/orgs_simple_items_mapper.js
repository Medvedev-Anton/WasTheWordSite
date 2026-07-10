import OrgsSimpleItemsMapperInterface from "./orgs_simple_items_mapper_interface.js";

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
                o.count as count
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
}