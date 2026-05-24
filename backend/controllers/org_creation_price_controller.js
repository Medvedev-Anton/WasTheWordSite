import { OrgCreationPriceFacade } from "../facades/org_creation_price_facade.js";
import { MainController } from "./main_controller.js";

export class OrgCreationPriceController extends MainController {
    constructor(request, response) {
        super(request, response);
    }

    /**
     * Обработчик получения всех цен организаций
     */
    getAllPrices() {
        try {
            const prices = OrgCreationPriceFacade.getAllPrices();
            this.send(200, {
                prices: prices
            });
        }
        catch (e) {
            console.error('Get all orgs creation prices error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик обновления цены организации
     */
    updatePrice() {
        const validate = this.has([
            'orgType',
            'newPrice'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const newPrice = parseFloat(this.request.body.newPrice);
            const orgType = this.request.body.orgType;

            OrgCreationPriceFacade.updateOrgPrice(orgType, newPrice);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update orgs creation price error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}