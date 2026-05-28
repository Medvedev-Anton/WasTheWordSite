export class SalaryMapperInterface {
    constructor() {
        if (new.target === 'SalaryMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса SalaryMapperInterface');
        }
    }

    /**
     * Получает зарплаты пользователя
     * @param {number} userId
     */
    getUserSalaryies(userId) {
        throw new Error('getUserSalaryies должен быть переопределен в наследнике');
    }

    /**
     * Создает строку с зарплатой пользователя
     * @param {number} userId
     * @param {number} orgId
     * @param {number} salary
     * @param {string} payday
     */
    create(userId, orgId, salary, payday) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Удаляет строку с зарплатой пользователя
     * @param {number} userId
     * @param {number} orgId
     */
    delete(userId, orgId) {
        throw new Error('delete должен быть переопределен в наследнике');
    }
}