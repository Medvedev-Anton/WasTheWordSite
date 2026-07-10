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

    /**
     * Возвращает данные предмета мастерской
     * @param {number} workshopId
     */
    findItemByWorkshopId(workshopId) {
        throw new Error('findItemByWorkshopId должен быть переопределен в наследнике');
    }

    /**
     * Инкрементирует количество созданных предметов мастерской
     * @param {number} workshopId
     * @param {number} incrementValue
     */
    incrementCountCreated(workshopId, incrementValue) {
        throw new Error('incrementCountCreated должен быть переопределен в наследнике');
    }
}