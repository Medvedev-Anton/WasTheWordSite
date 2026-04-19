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

    getTotalCountSuborgsForSuborgsByUser(userId) {
        try {
            return this.mapper.getTotalCountSuborgsForSuborgsByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getTotalCountSuborgsForOrgsByUser(userId) {
        try {
            return this.mapper.getTotalCountSuborgsForOrgsByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getOrgMembers(orgId) {
        try {
            return this.mapper.getOrgMembers(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}