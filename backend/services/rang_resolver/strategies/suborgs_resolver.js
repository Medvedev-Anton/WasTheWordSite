import { RangResolveStrategy } from "./rang_resolve_strategy";

/**
 * Реализует логику вычисления ранга при создании подорганизаций
 */
export class SuborgsResolver extends RangResolveStrategy {
    resolve(userId) {
        return 0;
    }
}