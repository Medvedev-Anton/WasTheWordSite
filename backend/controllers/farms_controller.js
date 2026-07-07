import FarmsResourcesFacade from "../facades/farms_resources_facade.js";
import { MainController } from "./main_controller.js";

export default class FarmsController extends MainController {
    constructor(request, response) {
        super(request, response);
    }

    /**
     * Получить ресурс фермы
     */
    getFarmResource() {
        const validate = this.has([
            'id'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const farmId = parseInt(this.request.params.id);
            const resource = FarmsResourcesFacade.getByFarmId(farmId);

            this.send(200, {
                resource: resource
            });
        }
        catch (e) {
            console.error('Get farm resource error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}