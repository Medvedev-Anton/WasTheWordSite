import { RangResolveStrategy } from "./rang_resolve_strategy";

/**
 * Реализует логику вычисления ранга при создании постов
 */
export class PostResolver extends RangResolveStrategy {
    resolve(userId) {
        return 0;
    }
}