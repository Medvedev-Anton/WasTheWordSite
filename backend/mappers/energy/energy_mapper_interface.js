export default class EnergyMapperInterface {
    constructor() {
        if (new.target === 'EnergyMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса EnergyMapperInterface');
        }
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
    findByUser(userId) {
        throw new Error('findByUser должен быть переопределен в наследнике');
    }
}