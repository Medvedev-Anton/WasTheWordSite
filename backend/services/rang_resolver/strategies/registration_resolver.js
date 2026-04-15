import { RangResolveStrategy } from "./rang_resolve_strategy.js";

/**
 * Реализует логику вычисления ранга при регистрации
 */
export class RegistrationResolver extends RangResolveStrategy {
    resolve(userId) {
        return 0;
    }
}