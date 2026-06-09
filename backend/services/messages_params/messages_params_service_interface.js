import MessagesParamsMapperInterface from "../../mappers/messages_params/messages_params_mapper_interface.js";

export default class MessagesParamsServiceInterface {
    /**
     * @param {MessagesParamsMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'MessagesParamsServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса MessagesParamsServiceInterface');
        }

        this.mapper = mapper;
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