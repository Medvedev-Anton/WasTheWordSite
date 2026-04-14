import { RangResolveStrategy } from "./rang_resolve_strategy.js";
import { RangFacade } from "../../../facades/rang_facade.js";
import { OrgsFacade } from "../../../facades/orgs_facade.js";
import { RangResolverFacade } from "../../../facades/rang_resolver_facade.js";

/**
 * Реализует логику вычисления ранга для количества подорганизаций
 */
export class SuborgsResolver extends RangResolveStrategy {
    resolve(userId) {
        const maxOrderNumber = 13;
        
        let currentUserRangId = -1;

        try {
            currentUserRangId = RangFacade.getUserRangId(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }

        if (currentUserRangId === -1) {
            return -1;
        }

        let currentUserRangOrderNumber = 0;
        
        try {
            const rang = RangFacade.findById(currentUserRangId);
            currentUserRangOrderNumber = rang.getOrderNumber();
        }
        catch (e) {
            throw new Error(e.message);
        }

        if (typeof currentUserRangOrderNumber !== 'number' || currentUserRangOrderNumber < 0) {
            return currentUserRangId;
        }

        if (currentUserRangOrderNumber > maxOrderNumber) {
            return currentUserRangId;
        }

        if (currentUserRangOrderNumber <= 10) {
            const countSuborgs = OrgsFacade.getMaxCountSuborgsForSuborgsByUser(userId);

            if (countSuborgs < 1) {
                const minRangId = RangFacade.findByOrderNumber(5).getId();
                RangFacade.setUserRangId(minRangId, userId);
                return RangResolverFacade.getResolver('posts').calcRangId(userId);
            }

            const countAndRangMapperObj = {
                1: 6,
                2: 7,
                3: 8,
                4: 9,
                5: 10
            };

            const newRangNumber = countAndRangMapperObj[countSuborgs];

            if (newRangNumber !== undefined) {
                return RangFacade.findByOrderNumber(newRangNumber).getId();
            }            
            else {
                return RangFacade.findByOrderNumber(10).getId();
            }
        }
        else {
            const countSuborgs = OrgsFacade.getMaxCountSuborgsForOrgsByUser(userId);

            const countAndRangMapperObj = {
                1: 11,
                2: 12,
                3: 13,
            };

            const newRangNumber = countAndRangMapperObj[countSuborgs];

            return RangFacade.findByOrderNumber(newRangNumber).getId();
        }
    }
}