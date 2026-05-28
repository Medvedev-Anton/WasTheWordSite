import { SalaryMapper } from "../mappers/salary/salary_mapper.js";
import { SalaryService } from "../services/salary/salary_service.js";

export class SalaryFacade {
    static getService() {
        if (this.service == null) {
            this.service = new SalaryService(
                new SalaryMapper()
            );
        }

        return this.service;
    }

    /**
     * Получает зарплаты пользователя
     * @param {number} userId
     */
    static getUserSalaryies(userId) {
        try {
            return this.service.getUserSalaryies(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Создает строку с зарплатой пользователя
     * @param {number} userId
     * @param {number} orgId
     * @param {number} salary
     * @param {string} payday
     */
    create(userId, orgId, salary, payday) {
        try {
            return this.service.create(userId, orgId, salary, payday);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаляет строку с зарплатой пользователя
     * @param {number} userId
     * @param {number} orgId
     */
    delete(userId, orgId) {
        try {
            return this.service.delete(userId, orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}