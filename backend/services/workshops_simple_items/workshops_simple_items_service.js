import WorkshopsSimpleItemsServiceInterface from "./workshops_simple_items_service_interface.js";

export default class WorkshopsSimpleItemsService extends WorkshopsSimpleItemsServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    create(workshopId, simpleItemId) {
        try {
            return this.mapper.create(workshopId, simpleItemId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getWorkshopSimpleItem(workshopId) {
        try {
            return this.mapper.findItemByWorkshopId(workshopId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}