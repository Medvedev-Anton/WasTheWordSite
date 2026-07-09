import EnergyMapperInterface from "../../mappers/energy/energy_mapper_interface.js";

export default class EnergyServiceInterface {
    /**
     * @param {EnergyMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'EnergyServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса EnergyServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Получает значение энергии сущности
     * @param {number} entityId
     */
    get(entityId) {
        throw new Error('get должен быть переопределен в наследнике');
    }

    /**
     * Инкрементирует значение энергии сущности
     * @param {number} entityId
     * @param {number} incrementValue
     */
    increment(entityId, incrementValue) {
        throw new Error('increment должен быть переопределен в наследнике');
    }

    /**
     * Декрементирует значение энергии сущности
     * @param {number} entityId
     * @param {number} decrementValue
     */
    decrement(entityId, decrementValue) {
        throw new Error('decrement должен быть переопределен в наследнике');
    }
}