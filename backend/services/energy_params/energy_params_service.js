import EnergyParamsServiceInterface from "./energy_params_service_interface.js";

export default class EnergyParamsService extends EnergyParamsServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getBuyEnergyPrice() {
        try {
            return this.mapper.findByName('buyEnergyPrice');
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateBuyEnergyPrice(newValue) {
        try {
            return this.mapper.update('buyEnergyPrice', newValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getEnergyToOrgForOrgVisit() {
        try {
            return this.mapper.findByName('energyToOrgForOrgVisit');
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateEnergyToOrgForOrgVisit(newValue) {
        try {
            return this.mapper.update('energyToOrgForOrgVisit', newValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}