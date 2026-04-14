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
}