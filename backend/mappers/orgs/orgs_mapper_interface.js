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
    getAllOrgsIdsByType(orgType) {
        throw new Error('getAllOrgsIdsByType должен быть переопределен в наследнике');
    }
}