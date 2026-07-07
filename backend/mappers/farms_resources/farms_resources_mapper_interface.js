export default class FarmsResourcesMapperInterface {
    constructor() {
        if (new.target === 'FarmsResourcesMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса FarmsResourcesMapperInterface');
        }
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
    findByFarmId(farmId) {
        throw new Error('findByFarmId должен быть переопределен в наследнике');
    }
}