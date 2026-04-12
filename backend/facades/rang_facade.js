import { RangMapper } from "../mappers/rang/rang_mapper";
import { Rang } from "../models/rang";
import { RangService } from "../services/rang/rang_service";
import { RangsCollection } from "../collections/rangs_collection";

export class RangFacade {
    /**
     * Строит модель из объекта
     * @params {Array} params
     * @returns {Rang}
     */
    static buildFromArr(params) {
        return new Rang(
            params.id || 0,
            params.name || '',
            params.thumbnailUrl || ''
        );
    }

    /**
     * Обновляет ранг в БД
     * @param {Rang} rang 
     * @returns {int}
     */
    static update(rang) {
        service = new RangService(
            new RangMapper()
        );

        try {
            return service.update(rang);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает ранг по ID
     * @param {int} id 
     * @returns {Rang}
     */
    static findById(id) {
        service = new RangService(
            new RangMapper()
        );

        try {
            return service.findById(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает все ранги
     * @params {int} limit
     * @returns {RangsCollection}
     */
    findAll(limit = -1) {
        service = new RangService(
            new RangMapper()
        );

        try {
            return service.findAll(limit);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}