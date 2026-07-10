import WorkshopsSimpleItemsFacade from "../facades/workshops_simple_items_facade.js";
import { MainController } from "./main_controller.js";

export default class WorkshopsController extends MainController {
    constructor (request, response) {
        super(request, response);
    }

    /**
     * Возвращает создаваемый мастерской предмет
     */
    getSimpleItem() {
        const validate = this.has([
            'id'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const workshopId = parseInt(this.request.params.id);
            const simpleItem = WorkshopsSimpleItemsFacade.getWorkshopSimpleItem(workshopId);

            this.send(200, {
                simpleItem: simpleItem
            });
        }
        catch (e) {
            console.error('Get workshop simple item error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}