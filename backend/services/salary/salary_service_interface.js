import { SalaryMapperInterface } from "../../mappers/salary/salary_mapper_interface.js";

export class SalaryServiceInterface {
    /**
     * @param {SalaryMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'SalaryServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса SalaryServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Получает всех сотрудников
     */
    getAll() {
        throw new Error('getAll должен быть переопределен в наследнике');
    }

    /**
     * Получает всех сотрудников с их именами
     */
    getOrgSalariesWithNames(orgId) {
        throw new Error('getOrgSalariesWithNames должен быть переопределен в наследнике');
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

    /**
     * Обновляет зарплату сотрудника в организации
     * @param {number} userId
     * @param {number} orgId
     * @param {number} newSalary
     */
    updateSalary(userId, orgId, newSalary) {
        throw new Error('updateSalary должен быть переопределен в наследнике');
    }
}