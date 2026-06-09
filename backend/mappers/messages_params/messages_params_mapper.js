import MessagesParamsMapperInterface from "./messages_params_mapper_interface.js";
import { db } from "../../database/init.js";

export default class MessagesParamsMapper extends MessagesParamsMapperInterface {
    constructor() {
        super();
    }

    getByName(name) {
        const result = db.prepare(`
            SELECT
                value
            FROM
                messages_params
            WHERE
                name = ?    
        `).get(name);

        if (result === undefined) {
            return null;
        }

        return result.value;
    }

    updateByName(name, newValue) {
        db.prepare(`
            UPDATE
                messages_params
            SET
                value = ?
            WHERE
                name = ?
        `).run(newValue, name);
    }
}