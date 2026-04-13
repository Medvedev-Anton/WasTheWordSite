import { PostsFacade } from "../../../facades/posts_facade.js";
import { RangFacade } from "../../../facades/rang_facade.js";
import { RangResolveStrategy } from "./rang_resolve_strategy.js";

/**
 * Реализует логику вычисления ранга для количества постов
 */
export class PostResolver extends RangResolveStrategy {
    resolve(userId) {
        const maxOrderNumber = 5;

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

        if (currentUserRangOrderNumber >= maxOrderNumber) {
            return currentUserRangId;
        }

        const countUserPosts = PostsFacade.getTotalCountByUser(userId);

        if (typeof countUserPosts !== 'number') {
            return currentUserRang;
        }

        try {
            if (countUserPosts >= 1 && countUserPosts < 4) {
                return RangFacade.findByOrderNumber(1).getId();
            }
            else if (countUserPosts >= 4 && countUserPosts < 8) {
                return RangFacade.findByOrderNumber(2).getId();
            }
            else if (countUserPosts >= 8 && countUserPosts < 12) {
                return RangFacade.findByOrderNumber(3).getId();
            }
            else if (countUserPosts >= 12 && countUserPosts < 16) {
                return RangFacade.findByOrderNumber(4).getId();
            }
            else if (countUserPosts >= 16) {
                return RangFacade.findByOrderNumber(5).getId();
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}