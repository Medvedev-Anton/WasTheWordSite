import { RangServiceInterface } from "./rang_service_interface";

export class RangService extends RangServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    update(rang) {
        try {
            return this.mapper.update(rang);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    findById(id) {
        try {
            return this.mapper.findById(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    findAll(limit = -1) {
        try {
            return this.mapper.findAll(limit);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}