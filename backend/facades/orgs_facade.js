import { OrgsMapper } from "../mappers/orgs/orgs_mapper.js";
import { OrgsService } from "../services/orgs/orgs_service.js";
import { db } from "../database/init.js";
import { PricesFacade } from "./prices_facade.js";
import { BalanceFacade } from "./balance_facade.js";
import { ProfitFacade } from "./profit_facade.js";

export class OrgsFacade {
    /**
     * Возвращает количество организаций под авторством пользователя
     * @param {number} userId 
     * @returns {number}
     */
    static getTotalCountByUser(userId) {
        const service = new OrgsService(
            new OrgsMapper()
        );

        try {
            return service.getTotalCountByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает количество организаций верхнего уровня под авторством пользователя
     * @param {number} userId 
     * @returns {number}
     */
    static getTotalTopLevelCountByUser(userId) {
        const service = new OrgsService(
            new OrgsMapper()
        );

        try {
            return service.getTotalTopLevelCountByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает максимальное кол-во подорганизаций у подорганизаций под авторством пользователя
     * @param {number} userId
     * @return {number}
     */
    static getTotalCountSuborgsForSuborgsByUser(userId) {
        const service = new OrgsService(
            new OrgsMapper()
        );

        try {
            return service.getTotalCountSuborgsForSuborgsByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает максимальное кол-во подорганизаций у организаций под авторством пользователя
     * @param {number} userId
     * @return {number}
     */
    static getTotalCountSuborgsForOrgsByUser(userId) {
        const service = new OrgsService(
            new OrgsMapper()
        );

        try {
            return service.getTotalCountSuborgsForOrgsByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает максимальное кол-во подорганизаций у организаций под авторством пользователя
     * @param {number} orgId
     * @return {number}
     */
    static getOrgMembers(orgId) {
        const service = new OrgsService(
            new OrgsMapper()
        );

        try {
            return service.getOrgMembers(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает все организации по заданному типу
     * @param {string} orgType
     */
    static getAllOrgsIdsByType(orgType) {
        const service = new OrgsService(
            new OrgsMapper()
        );

        try {
            return service.getAllOrgsIdsByType(orgType);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Списывает сумму за просмотр поста и начисляет на баланс организации
     * @param {number} orgId
     * @param {number} userId
     */
    static payPostView(orgId, userId) {
        const service = new OrgsService(
            new OrgsMapper()
        );

        const transaction = db.transaction(() => {
            try {
                const viewPrice = PricesFacade.getPostViewPrice();
                BalanceFacade.entity('users').decrement(userId, viewPrice);

                const orgType = service.getOrgType(orgId);
                ProfitFacade.entity('orgs').orgType(orgType).processWithTax(orgId, viewPrice);
            }
            catch (e) {
                throw new Error(e.message);
            }
        });

        try {
            transaction();
        }
        catch (e) {
            throw new Error('Ошибка при обработке транзакции списания за просмотр поста: ' + e.message);
        }
    }
}