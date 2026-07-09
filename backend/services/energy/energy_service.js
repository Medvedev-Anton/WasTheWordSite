import EnergyServiceInterface from "./energy_service_interface.js";

export default class EnergyService extends EnergyServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    get(entityId) {
        try {
            return this.mapper.get(entityId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    increment(entityId, incrementValue) {
        try {
            return this.mapper.increment(entityId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    decrement(entityId, decrementValue) {
        try {
            return this.mapper.decrement(entityId, decrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}