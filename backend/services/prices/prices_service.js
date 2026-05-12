import { PricesMapperInterace } from "../../mappers/prices/prices_mapper_interface.js";

export class PricesService extends PricesMapperInterace {
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

    getOrgCreatePrice() {
        try {
            return this.mapper.getPriceByName('orgCreate');
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

    updateOrgCreatePrice(newPrice) {
        try {
            return this.mapper.updatePriceByName('orgCreate', newPrice);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}