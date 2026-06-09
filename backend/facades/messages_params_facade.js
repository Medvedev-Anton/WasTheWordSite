import MessagesParamsMapper from "../mappers/messages_params/messages_params_mapper.js";
import MessagesParamsService from "../services/messages_params/messages_params_service.js";

export default class MessagesParamsFacade {
    static getService() {
        return new MessagesParamsService(
            new MessagesParamsMapper()
        );
    }

    /**
     * Получение значения параметра по названию
     * @param {string} name
     */
    static getByName(name) {
        try {
            return this.getService().getByName(name);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновление значение параметра по названию
     * @param {string} name
     * @param {number} newValue
     */
    static updateByName(name, newValue) {
        try {
            return this.getService().updateByName(name, newValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}