import { OrgsServiceInterface } from "./orgs_service_interface.js";

export class OrgsService extends OrgsServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getTotalCountByUser(userId) {
        try {
            return this.mapper.getTotalCountByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getTotalTopLevelCountByUser(userId) {
        try {
            return this.mapper.getTotalTopLevelCountByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getMaxCountSuborgsForSuborgsByUser(userId) {
        try {
            return this.mapper.getMaxCountSuborgsForSuborgsByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}