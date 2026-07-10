import WorkshopsSimpleItemsMapperInterface from "./workshops_simple_items_mapper_interface.js";
import { db } from "../../database/init.js";

export default class WorkshopsSimpleItemsMapper extends WorkshopsSimpleItemsMapperInterface {
    constructor() {
        super();
    }

    create(workshopId, simpleItemId) {
        db.prepare(`
            INSERT INTO
                workshops_simple_items(workshopId, simpleItemId)
            VALUES (?, ?)
        `).run(workshopId, simpleItemId);
    }

    findItemByWorkshopId(workshopId) {
        const result = db.prepare(`
            SELECT
                i.*,
                o.count as countCreated
            FROM
                workshops_simple_items w
            JOIN
                simple_items i
            ON
                w.simpleItemId = i.id
            JOIN
                orgs_simple_items o
            ON
                o.orgId = w.workshopId
            WHERE
                w.workshopId = ?
        `);
    }
}