import EnergyParamsMapper from "../mappers/energy_params/energy_params_mapper.js";
import EnergyParamsService from "../services/energy_params/energy_params_service.js";

export default class EnergyParamsFacade {
    static getService() {
        return new EnergyParamsService(
            new EnergyParamsMapper()
        )
    }

    /**
     * Получить значение параметра цены покупки энергии
     */
    static getBuyEnergyPrice() {
        try {
            return this.getService().getBuyEnergyPrice();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Изменить значение параметра
     * @param {number} newValue
     */
    static updateBuyEnergyPrice(newValue) {
        try {
            return this.getService().updateBuyEnergyPrice(newValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получить значение параметра количества энергии, начисляемой организации за посещение ее страницы
     */
    static getEnergyToOrgForOrgVisit() {
        try {
            return this.getService().getEnergyToOrgForOrgVisit();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Изменить значение параметра количества энергии, начисляемой организации за посещение ее страницы
     * @param {number} newValue
     */
    static updateEnergyToOrgForOrgVisit(newValue) {
        try {
            return this.getService().updateEnergyToOrgForOrgVisit(newValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}