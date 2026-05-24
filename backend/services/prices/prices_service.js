import { PricesMapperInterace } from "../../mappers/prices/prices_mapper_interface.js";
import { PricesServiceInterface } from "./prices_service_interface.js";

export class PricesService extends PricesServiceInterface {
    /**
     * @param {PricesMapperInterace} mapper 
     */
    constructor(mapper) {
        super(mapper);
    }

    getPostViewPrice() {
        try {
            return this.mapper.getPriceByName('postView');
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updatePostViewPrice(newPrice) {
        try {
            return this.mapper.updatePriceByName('postView', newPrice);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}