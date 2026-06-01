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

    getOrgType(orgId) {
        try {
            return this.mapper.getOrgType(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getAllOrgsIdsByType(orgType) {
        try {
            return this.mapper.getAllOrgsIdsByType(orgType);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getAdminId(orgId) {
        try {
            return this.mapper.getAdminId(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getTotalBalancesSum() {
        try {
            return this.mapper.getTotalBalancesSum();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getAllUserOrgs(userId) {
        try {
            return this.mapper.getAllUserOrgs(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}