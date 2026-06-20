import EnergyMapper from "../mappers/energy/energy_mapper.js";
import EnergyService from "../services/energy/energy_service.js";

export default class EnergyFacade {
    static getService() {
        return new EnergyService(
            new EnergyMapper()
        );
    }

    /**
     * Инкрементирует значение энергии пользователя
     * @param {number} userId
     * @param {number} incrementValue
     */
    static incrementUser(userId, incrementValue) {
        try {
            return this.getService().incrementUser(userId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получает значение энергии пользователя
     * @param {number} userId
     */
    static getByUser(userId) {
        try {
            return this.getService().getByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}