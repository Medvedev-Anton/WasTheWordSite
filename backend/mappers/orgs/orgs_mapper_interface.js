export class OrgsMapperInterface {
    constructor() {
        if (new.target === 'OrgsMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса OrgsMapperInterface');
        }
    }

    /**
     * Возвращает количество организаций под авторством пользователя
     * @param {number} userId 
     * @returns {number}
     */
    getTotalCountByUser(userId) {
        throw new Error('getTotalCountByUser должен быть переопределен в наследнике');
    }

    /**
     * Возвращает количество организаций верхнего уровня под авторством пользователя
     * @param {number} userId 
     * @returns {number}
     */
    getTotalTopLevelCountByUser(userId) {
        throw new Error('getTotalCountByUser должен быть переопределен в наследнике');
    }

    /**
     * Возвращает максимальное кол-во подорганизаций у подорганизаций под авторством пользователя
     * @param {number} userId
     * @return {number}
     */
    getTotalCountSuborgsForSuborgsByUser(userId) {
        throw new Error('getTotalCountSuborgsForSuborgsByUser должен быть переопределен в наследнике');
    }

    /**
     * Возвращает максимальное кол-во подорганизаций у организаций под авторством пользователя
     * @param {number} userId
     * @return {number}
     */
    getTotalCountSuborgsForOrgsByUser(userId) {
        throw new Error('getTotalCountSuborgsForOrgsByUser должен быть переопределен в наследнике');
    }

    /**
     * Вовзращает массив ID всех участников организации
     * @param {number} orgId
     * @return {Array}
     */
    getOrgMembers(orgId) {
        throw new Error('getOrgMembers должен быть переопределен в наследнике');
    }

    /**
     * Возвращает тип организации
     * @param {number} orgId
     * @return {string}
     */
    getOrgType(orgId) {
        throw new Error('getOrgType должен быть переопределен в наследнике');
    }

    /**
     * Возвращает все организации по заданному типу
     * @param {string} orgType
     */
    getAllOrgsByType(orgType) {
        throw new Error('getAllOrgsByType должен быть переопределен в наследнике');
    }

    /**
     * Возвращает ID админа 
     * @param {number} orgId
     */
    getAdminId(orgId) {
        throw new Error('getAdminId должен быть переопределен в наследнике');
    }

    /**
     * Возвращает общий бюджет всех организаций
     */
    getTotalBalancesSum() {
        throw new Error('getTotalBalancesSum должен быть переопределен в наследнике');
    }

    /**
     * Возвращает все организации под владением пользователя
     * @param {number} userId
     */
    getAllUserOrgs(userId) {
        throw new Error('getAllUserOrgs должен быть переопределен в наследнике');
    }

    /**
     * Возвращает бюджет всех подорганизаций у организации
     * @param {number} orgId
     */
    getSuborgsBalancesByOrg(orgId) {
        throw new Error('getSuborgsBalancesByOrg должен быть переопределен в наследнике');
    }

    /**
     * Возвращает данные организации по id
     * @param {number} orgId
     */
    getById(orgId) {
        throw new Error('getById должен быть переопределен в наследнике');
    }

    /**
     * Возвращает баланс организации
     * @param {number} orgId
     */
    getOrgBalance(orgId) {
        throw new Error('getOrgBalance должен быть переопределен в наследнике');
    }

    /**
     * Возвращает энергию организации
     * @param {number} orgId
     */
    getOrgEnergy(orgId) {
        throw new Error('getOrgEnergy должен быть переопределен в наследнике');
    }
}