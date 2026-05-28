import { SalaryMapper } from "../mappers/salary/salary_mapper.js";
import { SalaryService } from "../services/salary/salary_service.js";
import { BalanceFacade } from "./balance_facade.js";
import { ProfitFacade } from "./profit_facade.js";
import { db } from "../database/init.js";

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
     * Получает всех сотрудников с их именами
     */
    static getAllWithNames() {
        try {
            return this.getService().getAllWithNames();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получает зарплаты пользователя
     * @param {number} userId
     */
    static getUserSalaryies(userId) {
        try {
            return this.getService().getUserSalaryies(userId);
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
    static create(userId, orgId, salary, payday) {
        try {
            return this.getService().create(userId, orgId, salary, payday);
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
    static delete(userId, orgId) {
        try {
            return this.getService().delete(userId, orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Начисляет зарплату сотруднику и списывает с баланса организации
     * @param {number} userId
     * @param {number} orgId
     * @param {number} salary
     */
    static paySalary(userId, orgId, salary) {
        const transaction = db.transaction(() => {
            try {
                BalanceFacade.entity('orgs').decrement(orgId, salary);
                ProfitFacade.entity('users').processWithTax(userId, salary);
            }
            catch (e) {
                throw new Error(e.message);
            }
        });

        try {
            transaction();            
        }
        catch (e) {
            throw new Error('Ошибка при обработке транзакции начисления зарплаты: ' + e.message);
        }
    }

    /**
     * Начисляет зарплату всем сотрудникам и списывает ее с баланса организации
     */
    static paySalaryToAllEmployees() {
        try {
            const employees = this.getService().getAll();

            employees.forEach(employee => {
                this.paySalary(employee.userId, employee.orgId, employee.salary);
            });
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}