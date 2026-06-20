import UsersOrgsVisitsMapper from "../mappers/users_orgs_visits/users_orgs_visits_mapper.js";
import UsersOrgsVisitsService from "../services/users_orgs_visits/users_orgs_visits_service.js";

export default class UsersOrgsVisitsFacade {
    static getService() {
        return new UsersOrgsVisitsService(
            new UsersOrgsVisitsMapper()
        );
    }

    /**
     * Создание записи о посещении
     * @param {number} userId
     * @param {number} orgId
     */
    static create(userId, orgId) {
        try {
            return this.getService().create(userId, orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получение записи о посещении
     * @param {number} userId
     * @param {number} orgId
     */
    static get(userId, orgId) {
        try {
            return this.getService().get(userId, orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}