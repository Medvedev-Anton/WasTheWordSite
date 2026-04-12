import { Model } from "./model";

export class Rang extends Model {
    constructor (id, name, thumbnailUrl) {
        this.id = id;
        this.name = name;
        this.thumbnailUrl = thumbnailUrl;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getThumbnailUrl() {
        return this.thumbnailUrl;
    }
}