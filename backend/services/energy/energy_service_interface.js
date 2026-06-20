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
     * Инкрементирует значение энергии пользователя
     * @param {number} userId
     * @param {number} incrementValue
     */
    incrementUser(userId, incrementValue) {
        throw new Error('incrementUser должен быть переопределен в наследнике');
    }

    /**
     * Получает значение энергии пользователя
     * @param {number} userId
     */
    getByUser(userId) {
        throw new Error('getByUser должен быть переопределен в наследнике');
    }
}