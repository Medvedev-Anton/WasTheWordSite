import { PricesMapper } from "../mappers/prices/prices_mapper.js";
import { PricesService } from "../services/prices/prices_service.js";

export class PricesFacade {
    static getService() {
        return new PricesService(
            new PricesMapper()
        );
    }

    /**
     * Получает цену за просмотр поста
     */
    getPostViewPrice() {
        try {
            return this.getService().getPostViewPrice();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновляет цену за создание поста
     */
    updatePostViewPrice(newPrice) {
        try {
            return this.getService().updatePostViewPrice(newPrice);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}