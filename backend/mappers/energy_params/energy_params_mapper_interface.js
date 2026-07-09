export default class EnergyParamsMapperInterface {
    constructor() {
        if (new.target === 'EnergyParamsMapperInterface') {
            throw new Error('нельзя создать экземпляр класса EnergyParamsMapperInterface');
        }
    }

    /**
     * Получить значение параметра
     * @param {string} name
     */
    findByName(name) {
        throw new Error('findByName должен быть переопределен в наследнике');
    }

    /**
     * Изменить значение параметра
     * @param {string} name
     * @param {number} newValue
     */
    update(name, newValue) {
        throw new Error('update должен быть переопределен в наследнике');
    }
}