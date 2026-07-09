import EnergyMapperInterface from "./energy_mapper_interface.js";
import { db } from "../../database/init.js";

export default class EnergyOrgsMapper extends EnergyMapperInterface {
    /**
     * Получает значение энергии организации
     * @param {number} orgId
     */
    get(orgId) {
        const result = db.prepare(`
            SELECT
                energy
            FROM
                organizations
            WHERE
                id = ?    
        `).get(orgId);

        if (result === undefined) {
            return 0;
        }

        const energy = parseInt(result.energy);

        if (isNaN(energy)) {
            return 0;
        }

        return energy;
    }

    /**
     * Инкрементирует значение энергии организации
     * @param {number} orgId
     * @param {number} incrementValue
     */
    increment(orgId, incrementValue) {
        db.prepare(`
            UPDATE
                organizations
            SET
                energy = energy + ?
            WHERE
                id = ?    
        `).run(incrementValue, orgId);
    }

    /**
     * Декрементирует значение энергии организации
     * @param {number} orgId
     * @param {number} decrementValue
     */
    decrement(orgId, decrementValue) {
        db.prepare(`
            UPDATE
                organizations
            SET
                energy = energy - ?
            WHERE
                id = ?    
        `).run(decrementValue, orgId);
    }
}