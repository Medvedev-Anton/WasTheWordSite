import { RangResolveStrategy } from "./rang_resolve_strategy.js";
import { RangFacade } from "../../../facades/rang_facade.js";
import { OrgsFacade } from "../../../facades/orgs_facade.js";
import { RangResolverFacade } from "../../../facades/rang_resolver_facade.js";

/**
 * Реализует логику вычисления ранга при создании организаций
 */
export class OrgsResolver extends RangResolveStrategy {
    resolve(userId) {
        const maxOrderNumber = 20;

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

        const countUserOrgs = OrgsFacade.getTotalTopLevelCountByUser(userId);

        if (typeof countUserOrgs !== 'number') {
            return currentUserRang;
        }

        try {
            if (countUserOrgs < 1) {
                RangFacade.setUserRangId(13, userId);
                return RangResolverFacade.getResolver('suborgs').calcRangId(userId);
            }
            else if (countUserOrgs === 1) {
                return RangFacade.findByOrderNumber(14).getId();
            }
            else if (countUserOrgs === 2) {
                return RangFacade.findByOrderNumber(15).getId();
            }
            else if (countUserOrgs === 3) {
                return RangFacade.findByOrderNumber(16).getId();
            }
            else if (countUserOrgs === 4) {
                return RangFacade.findByOrderNumber(17).getId();
            }
            else if (countUserOrgs === 5) {
                return RangFacade.findByOrderNumber(18).getId();
            }
            else if (countUserOrgs === 6) {
                return RangFacade.findByOrderNumber(19).getId();
            }
            else if (countUserOrgs > 6 && countUserOrgs <= 10) {
                return RangFacade.findByOrderNumber(20).getId();
            }
            else if (countUserOrgs > 10) {
                return RangFacade.findByOrderNumber(20).getId();
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}