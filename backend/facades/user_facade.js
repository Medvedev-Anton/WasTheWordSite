import { RangFacade } from '../facades/rang_facade.js';
import { RangResolverFacade } from '../facades/rang_resolver_facade.js';

export class UserFacade {
    /**
     * Высчитывает и обновляет ранг пользователя
     * @param {int} userId
     * @param {string} entity
     */
    static calcAndUpdateRang(userId, entity) {
        try {
            const newRangId = RangResolverFacade.getResolver(entity).calcRangId(userId);

            RangFacade.setUserRangId(newRangId, userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}