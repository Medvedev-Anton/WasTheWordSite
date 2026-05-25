import { BankOrgParamsMapper } from "../mappers/bank_params/bank_org_params_mapper.js";
import { BankUserParamsMapper } from "../mappers/bank_params/bank_user_params_mapper.js";
import { BankParamsService } from "../services/bank_params/bank_params_service.js";
import { BankParamsServiceInterface } from "../services/bank_params/bank_params_service_interface.js";

export class BankFacade {
    constructor(entity) {
        if (entity === 'orgs') {
            this.service = new BankParamsService(
                new BankOrgParamsMapper()
            );
        }
        else if (entity === 'users') {
            this.service = new BankParamsService(
                new BankUserParamsMapper()
            );
        }
        else {
            throw new Error('Неизвестная сущность для работы с параметрами банков: ' + entity);
        }
    }

    static entity(entity) {
        return new this(entity);
    }

    /**
     * Получает набор параметров банка
     * @param {int} bankId
     * @return {object}
     */
    getBankAllParams(bankId) {
        try {
            return this.service.getBankAllParams(bankId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Создает строку с набором параметров банка по умолчанию
     * @param {int} bankId
     * @return {void}
     */
    createBankRowDefault(bankId) {
        try {
            return this.service.createBankRowDefault(bankId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновляет процент по кредиту
     * @param {int} bankId
     * @param {int} newPercent
     * @return {void}
     */
    updateLoanPercent(bankId, newPercent) {
        try {
            return this.service.updateLoanPercent(bankId, newPercent);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновляет срок кредита
     * @param {int} bankId
     * @param {int} newDuringDays
     * @return {void}
     */
    updateLoanDuring(bankId, newDuringDays) {
        try {
            return this.service.updateLoanDuring(bankId, newDuringDays);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}