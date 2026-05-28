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
     * @param {number} paymentSum
     */
    insertLoanData(creditorId, borrowerId, startSum, paymentSum) {
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
}