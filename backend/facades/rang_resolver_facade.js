import { RangResolver } from '../services/rang_resolver/rang_resolver.js';
import { RangResolverStrategyFactory } from '../services/rang_resolver/strategy_factory/rang_resolver_strategy_factory.js';

export class RangResolverFacade {
    /**
     * Возвращает объект вычислителя ранга для конкретной сущности
     * @param {string} entity
     * @returns {RangResolver}
     */
    static getResolver(entity) {
        const strategy = RangResolverStrategyFactory.get(entity);

        if (strategy === undefined) {
            return null;
        }

        return new RangResolver(strategy);
    }
}