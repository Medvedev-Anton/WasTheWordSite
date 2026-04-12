import { RangResolveStrategy } from "./rang_resolve_strategy";

/**
 * Реализует логику вычисления ранга при создании организаций
 */
export class OrgsResolver extends RangResolveStrategy {
    resolve(userId) {
        return 0;
    }
}