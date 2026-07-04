import SimpleItemsMapperInterface from "./simple_items_mapper_interface.js";

export default class SimpleItemsMapper extends SimpleItemsMapperInterface {
    constructor() {
        super();
    }

    findAll() {
        const result = db.prepare(`
            SELECT
                *
            FROM
                simple_items
        `).all();

        return result;
    }

    create(number, name, imageUrl, countNeedEnergy, countNeedMoney, resourceId, countNeedResource) {
        const result = db.prepare(`
            INSERT INTO
                simple_items (number, name, imageUrl, countNeedEnergy, countNeedMoney, resourceId, countNeedResource)
            VALUES(?, ?, ?, ?, ?, ?, ?)            
        `).run(number, name, imageUrl, countNeedEnergy, countNeedMoney, resourceId, countNeedResource);
    }

    delete(id) {
        db.prepare(`
            DELETE FROM
                simple_items
            WHERE
                id = ?
        `).run(id);
    }

    update(id, fieldName, newValue) {
        db.prepare(`
            UPDATE
                simple_items
            SET
                ${fieldName} = ?
            WHERE
                id = ?
        `).run(newValue, id);
    }

    findById(id) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                simple_items
            WHERE
                id = ? 
        `).get(id);

        return result || null;
    }
}