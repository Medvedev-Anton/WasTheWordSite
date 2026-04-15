import { RegistrationResolver } from '../strategies/registration_resolver.js';
import { PostResolver } from '../strategies/post_resolver.js';
import { SuborgsResolver } from '../strategies/suborgs_resolver.js';
import { OrgsResolver } from '../strategies/orgs_resolver.js';
import { RangResolveStrategy } from '../strategies/rang_resolve_strategy.js';

export class RangResolverStrategyFactory {
    static strategies = {
        registration: new RegistrationResolver(),
        posts: new PostResolver(),
        suborgs: new SuborgsResolver(),
        orgs: new OrgsResolver()
    };

    /**
     * Возвращает стратегию в зависимости от типа сущности
     * 
     * @param {string} entity
     * @returns {RangResolveStrategy}
     */
    static get(entity) {
        return this.strategies[entity];
    }
}