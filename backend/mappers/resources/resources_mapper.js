import ResourcesMapperInterface from "./resources_mapper_interface.js";
import { db } from "../../database/init.js";

export default class ResourcesMapper extends ResourcesMapperInterface {
    constructor() {
        super();
    }

    findAll() {
        const result = db.prepare(`
            SELECT
                *
            FROM
                resources
        `).all();

        return result;
    }

    create(name, imageUrl, countNeedEnergy, countNeedMoney) {
        const result = db.prepare(`
            INSERT INTO
                resources (name, imageUrl, countNeedEnergy, countNeedMoney)
            VALUES(?, ?, ?, ?)            
        `).run(name, imageUrl, countNeedEnergy, countNeedMoney);
    }

    delete(id) {
        db.prepare(`
            DELETE FROM
                resources
            WHERE
                id = ?
        `).run(id);
    }

    update(id, fieldName, newValue) {
        db.prepare(`
            UPDATE
                resources
            SET
                ? = ?
            WHERE
                id = ?
        `).run(fieldName, newValue, id);
    }

    findById(id) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                resources
            WHERE
                id = ? 
        `).get(id);

        return result || null;
    }
}