import { BankParamsMapperInterface } from "../../mappers/bank_params/bank_params_mapper_interface.js";

export class BankParamsServiceInterface {
    /**
     * @param {BankParamsMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'BankParamsServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса BankParamsServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Получает набор параметров банка
     * @param {int} bankId
     * @return {object}
     */
    getBankAllParams(bankId) {
        throw new Error('getBankAllParams должен быть переопределен в наследнике'); 
    }

    /**
     * Получает набор параметров банка только соответствующей сущности
     * @param {int} bankId
     * @return {object}
     */
    getBankEntityParams(bankId) {
        throw new Error('getBankEntityParams должен быть переопределен в наследнике');
    }

    /**
     * Создает строку с набором параметров банка по умолчанию
     * @param {int} bankId
     * @return {void}
     */
    createBankRowDefault(bankId) {
        throw new Error('createBankRowDefault должен быть переопределен в наследнике'); 
    }

    /**
     * Обновляет процент по кредиту
     * @param {int} bankId
     * @param {int} newPercent
     * @return {void}
     */
    updateLoanPercent(bankId, newPercent) {
        throw new Error('updateLoanPercent должен быть переопределен в наследнике');
    }

    /**
     * Обновляет срок кредита
     * @param {int} bankId
     * @param {int} newDuringDays
     * @return {void}
     */
    updateLoanDuring(bankId, newDuringDays) {
        throw new Error('updateLoanDuring должен быть переопределен в наследнике');
    }
}