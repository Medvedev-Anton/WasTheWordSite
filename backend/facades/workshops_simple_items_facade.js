import WorkshopsSimpleItemsMapper from "../mappers/workshops_simple_items/workshops_simple_items_mapper.js";
import WorkshopsSimpleItemsService from "../services/workshops_simple_items/workshops_simple_items_service.js";

export default class WorkshopsSimpleItemsFacade {
    static getService() {
        return new WorkshopsSimpleItemsService(
            new WorkshopsSimpleItemsMapper()
        );
    }

    /**
     * Создание записи
     * @param {number} workshopId
     * @param {number} simpleItemId
     */
    static create(workshopId, simpleItemId) {
        try {
            return this.getService().create(workshopId, simpleItemId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает данные предмета мастерской
     * @param {number} workshopId
     */
    static getWorkshopSimpleItem(workshopId) {
        try {
            return this.getService().getWorkshopSimpleItem(workshopId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}