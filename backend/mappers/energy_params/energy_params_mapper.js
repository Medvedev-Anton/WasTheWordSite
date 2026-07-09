import EnergyParamsMapperInterface from "./energy_params_mapper_interface.js";
import { db } from "../../database/init.js";

export default class EnergyParamsMapper extends EnergyParamsMapperInterface {
    constructor() {
        super();
    }

    findByName(name) {
        const result = db.prepare(`
            SELECT
                value
            FROM
                energy_params
            WHERE
                name = ?    
        `).get(name);

        if (result === undefined || result === null) {
            return null;
        }

        const value = parseInt(result.value);

        if (isNaN(value)) {
            return null;
        }

        return value;
    }

    update(name, newValue) {
        db.prepare(`
            UPDATE
               energy_params
            SET
                value = ?
            WHERE
                name = ?     
        `).run(newValue, name);
    }
}