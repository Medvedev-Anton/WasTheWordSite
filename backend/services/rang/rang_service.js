import { RangServiceInterface } from "./rang_service_interface.js";

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

    create(rang) {
        try {
            return this.mapper.create(rang);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    delete(id) {
        try {
            return this.mapper.delete(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}