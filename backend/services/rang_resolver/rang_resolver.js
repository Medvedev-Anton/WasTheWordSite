import { RangResolveStrategy } from './strategies/rang_resolve_strategy.js'; 

export class RangResolver {
    /**
     * @param {RangResolveStrategy} strategy 
     */
    constructor(strategy) {
        this.strategy = strategy;
    }

    /**
     * Вычисляет ID ранга
     * @param {int} userId 
     * @returns int
     */
    calcRangId(userId) {
        return this.strategy.resolve(userId);
    }
}