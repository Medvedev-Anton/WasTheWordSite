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
}