import UsersOrgsVisitsServiceInterface from "./users_orgs_visits_service_interface.js";

export default class UsersOrgsVisitsService extends UsersOrgsVisitsServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    create(userId, orgId) {
        try {
            return this.mapper.create(userId, orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    get(userId, orgId) {
        try {
            return this.mapper.find(userId, orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}