import EnergyMapperInterface from "./energy_mapper_interface.js";
import { db } from "../../database/init.js";

export default class EnergyMapper extends EnergyMapperInterface {
    constructor() {
        super();
    }

    incrementUser(userId, incrementValue) {
        db.prepare(`
            UPDATE
                users
            SET
                energy = energy + ?
            WHERE
                id = ?    
        `).run(incrementValue, userId);
    }

    findByUser(userId) {
        const result = db.prepare(`
            SELECT
                energy
            FROM
                users
            WHERE
                id = ?    
        `).get(userId);

        if (result === undefined) {
            return 0;
        }

        const energy = parseInt(result.energy);

        if (isNaN(energy)) {
            return 0;
        }

        return energy;
    }
}