import MessagesParamsServiceInterface from "./messages_params_service_interface.js";

export default class MessagesParamsService extends MessagesParamsServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getByName(name) {
        try {
            return this.mapper.getByName(name);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateByName(name, newValue) {
        try {
            return this.mapper.updateByName(name, newValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}