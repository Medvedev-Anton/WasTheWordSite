import { BankParamsMapper } from "../mappers/bank_params/bank_params_mapper.js";
import { BankParamsService } from "../services/bank_params/bank_params_service.js";
import { BankParamsServiceInterface } from "../services/bank_params/bank_params_service_interface";

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
    getBankParams(bankId) {
        try {
            return this.paramsService().getBankParams(bankId);
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
    updateUserPercent(bankId, newPercent) {
        try {
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
    updateUserDuring(bankId, newDuringDays) {
        try {
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
    updateOrgPercent(bankId, newPercent) {
        try {
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
    updateOrgDuring(bankId, newDuringDays) {
        try {
            return this.paramsService().updateOrgDuring(bankId, newDuringDays);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}