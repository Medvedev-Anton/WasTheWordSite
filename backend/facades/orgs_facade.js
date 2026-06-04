import { OrgsMapper } from "../mappers/orgs/orgs_mapper.js";
import { OrgsService } from "../services/orgs/orgs_service.js";
import { db } from "../database/init.js";
import { PricesFacade } from "./prices_facade.js";
import { BalanceFacade } from "./balance_facade.js";
import { ProfitFacade } from "./profit_facade.js";
import { OrgCreationPriceFacade } from "./org_creation_price_facade.js";

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

    /**
     * Пополняет баланс организации со счета пользователя
     * @param {number} orgId
     * @param {number} userId
     * @param {number} sum
     */
    static transferFromAuthorToOrgBalance(orgId, userId, sum) {
        const service = new OrgsService(
            new OrgsMapper()
        );

        const transaction = db.transaction(() => {
            try {
                const adminId = service.getAdminId(orgId);

                if (userId != adminId) {
                    throw new Error('пользователь не явялется владельцем организации');
                }

                const currentAdminBalance = BalanceFacade.entity('users').getBalance(adminId);

                if (currentAdminBalance < sum) {
                    throw new Error('недостаточно средств для перевода');
                }

                BalanceFacade.entity('users').decrement(adminId, sum);
                BalanceFacade.entity('orgs').increment(orgId, sum);
            }
            catch (e) {
                throw new Error(e.message);
            }
        });

        try {
            transaction();
        }
        catch (e) {
            throw new Error('Ошибка при обработке транзакции по переводу с баланса автора организации на баланс организации: ' + e.message);
        }
    }

    /**
     * Проверяет есть ли у пользователя средства на создание организации
     * @param {string} orgType
     * @param {number} userId
     */
    static checkHasBalanceToCreate(orgType, userId) {
        try {
            const creationPrice = OrgCreationPriceFacade.getOrgPrice(orgType);

            if (creationPrice == 0) {
                return true;
            }

            const userBalance = BalanceFacade.entity('users').getBalance(userId);

            if (userBalance < creationPrice) {
                return false;
            }

            return true;
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Списывает деньги со счета пользователя за создание организации
     * @param {string} orgType
     * @param {number} userId
     */
    static payForOrgCreation(orgType, userId) {
        const transaction = db.transaction(() => {
            try {
                const creationPrice = OrgCreationPriceFacade.getOrgPrice(orgType);

                if (creationPrice == 0) {
                    return;
                }

                const goverId = this.getAllOrgsIdsByType('Правительственная')[0] ?
                                    this.getAllOrgsIdsByType('Правительственная')[0].id :
                                    null;

                BalanceFacade.entity('users').decrement(userId, creationPrice);
                BalanceFacade.entity('orgs').increment(goverId, creationPrice);
            }
            catch (e) {
                throw new Error(e.message);
            }
        });

        try {
            transaction();
        }
        catch (e) {
            throw new Error('Ошибка при обработке транзакции по оплате создания организации: ' + e.message);
        }
    }

    /**
     * Возвращает общий бюджет всех организаций
     */
    static getTotalBalancesSum() {
        const service = new OrgsService(
            new OrgsMapper()
        );

        try {
            return service.getTotalBalancesSum();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает все организации под владением пользователя
     * @param {number} userId
     */
    static getAllUserOrgs(userId) {
        const service = new OrgsService(
            new OrgsMapper()
        );

        try {
            return service.getAllUserOrgs(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает ID админа организации
     * @param {number} orgId
     */
    static getAdminId(orgId) {
        const service = new OrgsService(
            new OrgsMapper()
        );
        
        try {
            return service.getAdminId(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает бюджет всех подорганизаций у организации
     * @param {number} orgId
     */
    static getSuborgsBalancesByOrg(orgId) {
        const service = new OrgsService(
            new OrgsMapper()
        );
        
        try {
            return service.getSuborgsBalancesByOrg(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Переводит с баланса организации на баланс подорганизации
     * @param {number} orgId
     * @param {number} suborgId
     * @param {number} sum
     */
    static transferFromOrgToSuborgBalance(orgId, suborgId, sum) {
        const transaction = db.transaction(() => {
            try {
                const orgBalance = BalanceFacade.entity('orgs').getBalance(orgId);

                if (orgBalance < sum) {
                    throw new Error('Недостаточно средств');
                }

                BalanceFacade.entity('orgs').decrement(orgId, sum);
                BalanceFacade.entity('orgs').increment(suborgId, sum);
            }
            catch (e) {
                throw new Error(e.message);
            }
        });

        try {
            transaction();
        }
        catch (e) {
            throw new Error('Ошибка при обработке транзакции перевода с организации в подорганизацию: ' + e.message);
        }
    }

    /**
     * Пополняет баланс админа со счета организации
     * @param {number} orgId
     * @param {number} userId
     * @param {number} sum
     */
    static transferFromOrgToAuthorBalance(orgId, userId, sum) {
        const service = new OrgsService(
            new OrgsMapper()
        );

        const transaction = db.transaction(() => {
            try {
                const adminId = service.getAdminId(orgId);

                if (userId != adminId) {
                    throw new Error('пользователь не явялется владельцем организации');
                }

                const currentOrgBalance = BalanceFacade.entity('orgs').getBalance(orgId);

                if (currentOrgBalance < sum) {
                    throw new Error('недостаточно средств для перевода');
                }

                BalanceFacade.entity('orgs').decrement(orgId, sum);
                BalanceFacade.entity('users').increment(adminId, sum);
            }
            catch (e) {
                throw new Error(e.message);
            }
        });

        try {
            transaction();
        }
        catch (e) {
            throw new Error('Ошибка при обработке транзакции по переводу с баланса автора организации на баланс организации: ' + e.message);
        }
    }
}