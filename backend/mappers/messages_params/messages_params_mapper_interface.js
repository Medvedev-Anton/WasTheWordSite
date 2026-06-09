export default class MessagesParamsMapperInterface {
    constructor() {
        if (new.target === 'MessagesParamsMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса MessagesParamsMapperInterface');
        }
    }

    /**
     * Получение значения параметра по названию
     * @param {string} name
     */
    getByName(name) {
        throw new Error('getByName должен быть переопределен в наследнике');
    }

    /**
     * Обновление значение параметра по названию
     * @param {string} name
     * @param {number} newValue
     */
    updateByName(name, newValue) {
        throw new Error('updateByName должен быть переопределен в наследнике');
    }
}