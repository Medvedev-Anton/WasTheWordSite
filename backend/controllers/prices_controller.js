import { PricesFacade } from "../facades/prices_facade.js";
import { MainController } from "./main_controller.js";

export class PricesController extends MainController {
    constructor (request, response) {
        super(request, response);
    }

    /**
     * Обработчик получения цены за просмотр поста
     */
    getPostViewPrice() {
        try {
            const price = PricesFacade.getPostViewPrice();

            this.send(200, {
                price: price
            });
        }
        catch (e) {
            console.error('Get post view price errror:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик обновления цены за просмотр поста
     */
    updatePostViewPrice() {
        const validate = this.has([
            'newPrice'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const newPrice = parseInt(this.request.body.newPrice);
            PricesFacade.updatePostViewPrice(newPrice);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update post view price errror:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}