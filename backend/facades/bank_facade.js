import { BankParamsMapper } from "../mappers/bank_params/bank_params_mapper.js";
import { BankParamsService } from "../services/bank_params/bank_params_service.js";
import { BankParamsServiceInterface } from "../services/bank_params/bank_params_service_interface.js";

export class BankFacade {
    /**
     * Возвращает объект сервиса параметров
     * @return {BankParamsServiceInterface}
     */
    static paramsService() {
        return new BankParamsService(
            new BankParamsMapper()
        );
    }

    /**
     * Получает набор параметров банка
     * @param {int} bankId
     * @return {object}
     */
    static getBankParams(bankId) {
        try {
            return this.paramsService().getBankParams(bankId);
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
    static createBankRowDefault(bankId) {
        try {
            return this.paramsService().createBankRowDefault(bankId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновляет процент по кредиту для пользователей
     * @param {int} bankId
     * @param {int} newPercent
     * @return {void}
     */
    static updateUserPercent(bankId, newPercent) {
        try {
            if (this.getBankParams(bankId) === undefined) {
                this.createBankRowDefault(bankId);
            }
            
            return this.paramsService().updateUserPercent(bankId, newPercent);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновляет срок кредита для пользователей
     * @param {int} bankId
     * @param {int} newDuringDays
     * @return {void}
     */
    static updateUserDuring(bankId, newDuringDays) {
        try {
            if (this.getBankParams(bankId) === undefined) {
                this.createBankRowDefault(bankId);
            }

            return this.paramsService().updateUserDuring(bankId, newDuringDays);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновляет процент по кредиту для организаций
     * @param {int} bankId
     * @param {int} newPercent
     * @return {void}
     */
    static updateOrgPercent(bankId, newPercent) {
        try {
            if (this.getBankParams(bankId) === undefined) {
                this.createBankRowDefault(bankId);
            }

            return this.paramsService().updateOrgPercent(bankId, newPercent);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновляет срок кредита для организаций
     * @param {int} bankId
     * @param {int} newDuringDays
     * @return {void}
     */
    static updateOrgDuring(bankId, newDuringDays) {
        try {
            if (this.getBankParams(bankId) === undefined) {
                this.createBankRowDefault(bankId);
            }

            return this.paramsService().updateOrgDuring(bankId, newDuringDays);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}