import { LoansMapperInterface } from "../../mappers/loans/loans_mapper_interface.js";

export class LoansServiceInterface {
    /**
     * @param {LoansMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'LoansServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса LoansServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Получить ID всех заемщиков кредитора
     * @param {number} creditorId
     */
    getAllBorrowersByCreditor(creditorId) {
        throw new Error('getAllBorrowersByCreditor должен быть переопределен в наследнике');
    }

    /**
     * Вычисляет финальную сумму кредита
     * @param {number} sum
     * @param {number} percents
     * @param {number} days
     * @return {number}
     */
    calcFinalSum(sum, percents, days) {
        throw new Error('calcFinalSum должен быть переопределен в наследнике');
    }

    /**
     * Вычисляет ежедневный платеж
     * @param {number} sum
     * @param {number} days
     * @return {number}
     */
    calcDailyPayment(sum, days) {
        throw new Error('calcDailyPayment должен быть переопределен в наследнике');
    }

    /**
     * Создать данные о кредите
     * @param {number} creditorId
     * @param {number} borrowerId
     * @param {number} startSum
     * @param {number} paymentSum
     */
    createLoan(creditorId, borrowerId, startSum, paymentSum) {
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
}