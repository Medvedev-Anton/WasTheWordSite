import { db } from "../../database/init.js";
import { OrgsFacade } from "../../facades/orgs_facade.js";

export class LoansMapperInterface {
    constructor() {
        if (new.target === 'LoansMapperInterface') {
            throw new Error('Нельзя создать экзмепляр класса LoansMapperInterface');
        }
    }

    /**
     * Получить данные всех заемщиков кредитора
     * @param {number} creditorId
     */
    getAllBorrowersByCreditor(creditorId) {
        throw new Error('getAllBorrowersByCreditor должен быть переопределен в наследнике');
    }

    /**
     * Создать данные о кредите
     * @param {number} creditorId
     * @param {number} borrowerId
     * @param {number} startSum
     * @param {number} sumToPay
     * @param {number} paymentSum
     */
    insertLoanData(creditorId, borrowerId, startSum, sumToPay, paymentSum) {
        throw new Error('insertLoanData должен быть переопределен в наследнике');
    }

    /**
     * Списать платеж по кредиту у сущности
     * @param {number} entityId
     */
    decrementLoanSum(entityId) {
        throw new Error('decrementLoanSum должен быть переопределен в наследнике');
    }

    /**
     * Возвращает сумму платежа по кредиту
     * @param {number} entityId
     */
    getPaymentSum(entityId) {
        throw new Error('decrementLoanSum должен быть переопределен в наследнике');
    }

    /**
     * Возвращает текущую сумму кредита
     * @param {number} entityId
     */
    getCurrentSum(entityId) {
        throw new Error('getCurrentSum должен быть переопределен в наследнике');
    }

    /**
     * Удаляет запись о кредите
     * @param {number} entityId
     * @param {number} bankId
     */
    delete(entityId, bankId) {
        throw new Error('delete должен быть переопределен в наследнике');
    }

    /**
     * Проверяет наличие кредитов у пользователя
     * @param {number} userId
     */
    isUserLoanExists(userId) {
        const existsUserLoans = db.prepare(`
            SELECT
                *
            FROM
                users_loans
            WHERE
                borrowerId = ?    
        `).all(userId);

        const allUserOrgs = OrgsFacade.getAllUserOrgs(userId);
        const allUserOrgsIds = allUserOrgs.map(org => org.id);

        const query = `
            SELECT * FROM orgs_loans 
            WHERE borrowerId IN (SELECT value FROM json_each(?))
        `;

        const existsUserOrgsLoans = db.prepare(query).all(JSON.stringify(allUserOrgsIds));

        return (existsUserLoans.length != 0) && (existsUserOrgsLoans.length != 0);
    }
}