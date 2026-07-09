import EnergyOrgsMapper from "../mappers/energy/energy_orgs_mapper.js";
import EnergyUsersMapper from "../mappers/energy/energy_users_mapper.js";
import EnergyService from "../services/energy/energy_service.js";

export default class EnergyFacade {
    constructor(entity) {
        if (entity === 'users') {
            this.service = new EnergyService(
                new EnergyUsersMapper()
            );
        }
        else if (entity === 'orgs') {
            this.service = new EnergyService(
                new EnergyOrgsMapper()
            );
        }
        else {
            throw new Error('Неизвестная сущность для работы с энергией: ' + entity);
        }
    }

    static entity(entity) {
        return new this(entity);
    }

    /**
     * Получает значение энергии сущности
     * @param {number} userId
     */
    get(entityId) {
        try {
            return this.service.get(entityId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Инкрементирует значение энергии сущности
     * @param {number} entityId
     * @param {number} incrementValue
     */
    increment(entityId, incrementValue) {
        try {
            return this.service.increment(entityId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Декрементирует значение энергии сущности
     * @param {number} entityId
     * @param {number} decrementValue
     */
    decrement(entityId, decrementValue) {
        try {
            return this.service.decrement(entityId, decrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}