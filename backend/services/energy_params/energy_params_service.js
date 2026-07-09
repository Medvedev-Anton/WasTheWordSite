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
}