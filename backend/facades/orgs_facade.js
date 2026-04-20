import { OrgsMapper } from "../mappers/orgs/orgs_mapper.js";
import { OrgsService } from "../services/orgs/orgs_service.js";

export class OrgsFacade {
    /**
     * Возвращает количество организаций под авторством пользователя
     * @param {int} userId 
     * @returns {int}
     */
    static getTotalCountByUser(userId) {
        const service = new OrgsService(
            new OrgsMapper()
        );

        try {
            return service.getTotalCountByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает количество организаций верхнего уровня под авторством пользователя
     * @param {int} userId 
     * @returns {int}
     */
    static getTotalTopLevelCountByUser(userId) {
        const service = new OrgsService(
            new OrgsMapper()
        );

        try {
            return service.getTotalTopLevelCountByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает максимальное кол-во подорганизаций у подорганизаций под авторством пользователя
     * @param {int} userId
     * @return {int}
     */
    static getTotalCountSuborgsForSuborgsByUser(userId) {
        const service = new OrgsService(
            new OrgsMapper()
        );

        try {
            return service.getTotalCountSuborgsForSuborgsByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает максимальное кол-во подорганизаций у организаций под авторством пользователя
     * @param {int} userId
     * @return {int}
     */
    static getTotalCountSuborgsForOrgsByUser(userId) {
        const service = new OrgsService(
            new OrgsMapper()
        );

        try {
            return service.getTotalCountSuborgsForOrgsByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает максимальное кол-во подорганизаций у организаций под авторством пользователя
     * @param {int} orgId
     * @return {int}
     */
    static getOrgMembers(orgId) {
        const service = new OrgsService(
            new OrgsMapper()
        );

        try {
            return service.getOrgMembers(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}