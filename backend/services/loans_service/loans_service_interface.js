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
}