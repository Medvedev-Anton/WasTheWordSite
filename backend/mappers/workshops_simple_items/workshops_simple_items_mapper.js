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
                w.countCreated as countCreated
            FROM
                workshops_simple_items w
            JOIN
                simple_items i
            ON
                o.orgId = w.workshopId
            WHERE
                w.workshopId = ?
        `).get(workshopId);

        console.log(workshopId);

        return result;
    }

    incrementCountCreated(workshopId, incrementValue) {
        db.prepare(`
            UPDATE
                workshops_simple_items
            SET
                countCreated = countCreated + ?
            WHERE
                workshopId = ?     
        `).run(incrementValue, workshopId);
    }
}