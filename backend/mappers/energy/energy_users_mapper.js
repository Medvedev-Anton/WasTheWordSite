import EnergyMapperInterface from "./energy_mapper_interface.js";
import { db } from "../../database/init.js";

export default class EnergyUsersMapper extends EnergyMapperInterface {
    /**
     * Получает значение энергии пользователя
     * @param {number} userId
     */
    get(userId) {
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

    /**
     * Инкрементирует значение энергии пользователя
     * @param {number} userId
     * @param {number} incrementValue
     */
    increment(userId, incrementValue) {
        db.prepare(`
            UPDATE
                users
            SET
                energy = energy + ?
            WHERE
                id = ?    
        `).run(incrementValue, userId);
    }

    /**
     * Декрементирует значение энергии пользователя
     * @param {number} userId
     * @param {number} decrementValue
     */
    decrement(userId, decrementValue) {
        db.prepare(`
            UPDATE
                users
            SET
                energy = energy - ?
            WHERE
                id = ?    
        `).run(decrementValue, userId);
    }
}