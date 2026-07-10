import FarmsResourcesMapperInterface from "../../mappers/farms_resources/farms_resources_mapper_interface.js";

export default class FarmsResourcesServiceInterface {
    /**
     * @param {FarmsResourcesMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'FarmsResourcesServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса FarmsResourcesServiceInterface');
        }        
    
        this.mapper = mapper;
    }

    /**
     * Создание записи
     * @param {number} farmId
     * @param {number} resourceId
     */
    create(farmId, resourceId) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Получить по ID фермы
     * @param {number} farmId
     */
    getByFarmId(farmId) {
        throw new Error('getByFarmId должен быть переопределен в наследнике');
    }

    /**
     * Инкрементирует количество добытого ресурса
     * @param {number} farmId
     * @param {number} incrementValue
     */
    incrementCountExtracted(farmId, incrementValue) {
        throw new Error('incrementCountExtracted должен быть переопределен в наследнике');
    }
}