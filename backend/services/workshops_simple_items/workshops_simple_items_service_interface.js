import WorkshopsSimpleItemsMapperInterface from "../../mappers/workshops_simple_items/workshops_simple_items_mapper_interface.js";

export default class WorkshopsSimpleItemsServiceInterface {
    /**
     * @param {WorkshopsSimpleItemsMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'WorkshopsSimpleItemsMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса WorkshopsSimpleItemsMapperInterface');
        }

        this.mapper = mapper;
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