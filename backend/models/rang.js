import { Model } from "./model.js";

export class Rang extends Model {
    constructor (id, name, thumbnailUrl, orderNumber) {
        super();
        this.id = id;
        this.name = name;
        this.thumbnailUrl = thumbnailUrl;
        this.orderNumber = orderNumber;
    }

    getId() {
        return parseInt(this.id);
    }

    getName() {
        return this.name;
    }

    getThumbnailUrl() {
        return this.thumbnailUrl;
    }

    getOrderNumber() {
        return this.orderNumber;
    }
}