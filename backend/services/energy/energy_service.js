import EnergyServiceInterface from "./energy_service_interface.js";

export default class EnergyService extends EnergyServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    incrementUser(userId, incrementValue) {
        try {
            return this.mapper.incrementUser(userId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getByUser(userId) {
        try {
            return this.mapper.findByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}