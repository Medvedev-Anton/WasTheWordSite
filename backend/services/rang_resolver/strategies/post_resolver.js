import { PostsFacade } from "../../../facades/posts_facade.js";
import { RangFacade } from "../../../facades/rang_facade.js";
import { RangResolveStrategy } from "./rang_resolve_strategy.js";

/**
 * Реализует логику вычисления ранга при создании постов
 */
export class PostResolver extends RangResolveStrategy {
    resolve(userId) {
        const minOrderNumber = 1;
        const maxOrderNumber = 5;

        let currentUserRang = -1;

        try {
            currentUserRang = RangFacade.getUserRangId(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }

        if (currentUserRang === -1) {
            return -1;
        }

        if (currentUserRang >= maxOrderNumber) {
            return currentUserRang;
        }

        const countUserPosts = PostsFacade.getTotalCountByUser(userId);

        if (typeof countUserPosts !== 'number') {
            return currentUserRang;
        }

        if (countUserPosts === 1) {
            
        }

        /**
         * 1) Получить текущий ранг пользователя
         * 2) Если текущий ранг больше maxOrderNumber, то возвращает его. Иначе идем далее
         * 3) Получаем количество созданных пользователем постов
         * 4) Вычисляем ранг в зависимости от количества постов
         * 5) Возвращаем вычисленный ранг
         */
    }
}