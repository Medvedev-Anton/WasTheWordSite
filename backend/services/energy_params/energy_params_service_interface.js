import EnergyParamsMapperInterface from "../../mappers/energy_params/energy_params_mapper_interface.js";

export default class EnergyParamsServiceInterface {
    /**
     * @param {EnergyParamsMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'EnergyParamsServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса EnergyParamsServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Получить значение параметра цены покупки энергии
     */
    getBuyEnergyPrice() {
        throw new Error('getBuyEnergyPrice должен быть переопределен в наследнике');
    }

    /**
     * Изменить значение параметра
     * @param {float} newValue
     */
    updateBuyEnergyPrice(newValue) {
        throw new Error('updateBuyEnergyPrice должен быть переопределен в наследнике');
    }
}