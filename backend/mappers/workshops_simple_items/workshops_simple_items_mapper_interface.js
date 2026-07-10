export default class WorkshopsSimpleItemsMapperInterface {
    constructor() {
        if (new.target === 'WorkshopsSimpleItemsMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса WorkshopsSimpleItemsMapperInterface');
        }
    }

    /**
     * Создание записи
     * @param {number} workshopId
     * @param {number} simpleItemId
     */
    create(workshopId, simpleItemId) {
        throw new Error('create должен быть переопределен в наследнике');
    }
}