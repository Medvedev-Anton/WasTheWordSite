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
     * @param {int} creditorId
     */
    getAllBorrowersByCreditor(creditorId) {
        throw new Error('getAllBorrowersByCreditor должен быть переопределен в наследнике');
    }
}