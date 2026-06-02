import { ProfitServiceInterface } from "./profit_service_interface.js";

export class ProfitService extends ProfitServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    create(entityId, incomingSum) {
        try {
            return this.mapper.insert(entityId, incomingSum);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getSumInDateInterval(entityId, dateStart, dateFinish) {
        try {
            return this.mapper.getSumInDateInterval(entityId, dateStart, dateFinish);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}