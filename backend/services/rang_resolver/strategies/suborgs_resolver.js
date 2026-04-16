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

            if (rang === null) {
                currentUserRangOrderNumber = 0;
            }
            else {
                currentUserRangOrderNumber = rang.getOrderNumber();
            }            
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

        const countSuborgsForSuborgs = OrgsFacade.getMaxCountSuborgsForSuborgsByUser(userId);
        const countSuborgsForOrgs = OrgsFacade.getMaxCountSuborgsForOrgsByUser(userId);

        if (Math.max(countSuborgsForSuborgs, countSuborgsForOrgs) === 0) {
            const minRangId = RangFacade.findByOrderNumber(5).getId();
            RangFacade.setUserRangId(minRangId, userId);
            return RangResolverFacade.getResolver('posts').calcRangId(userId);
        }

        let newRangNumberSuborgsForSuborgs = 0;
        let newRangNumberSuborgsForOrgs = 0;

        if (countSuborgsForSuborgs >= 1) {
            const countAndRangMapperObj = {
                1: 6,
                2: 7,
                3: 8,
                4: 9,
                5: 10
            };

            newRangNumberSuborgsForSuborgs = countAndRangMapperObj[countSuborgsForSuborgs] || 10;
        }

        if (countSuborgsForOrgs >= 1) {
            const countAndRangMapperObj = {
                1: 11,
                2: 12,
                3: 13,
            };

            newRangNumberSuborgsForOrgs = countAndRangMapperObj[countSuborgsForOrgs] || 13;
        }

        const newRangNumber = Math.max(newRangNumberSuborgsForSuborgs, newRangNumberSuborgsForOrgs);

        return RangFacade.findByOrderNumber(newRangNumber).getId();
    }
}