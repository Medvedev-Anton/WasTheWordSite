import { RangMapper } from "../mappers/rang/rang_mapper.js";
import { Rang } from "../models/rang.js";
import { RangService } from "../services/rang/rang_service.js";
import { RangsCollection } from "../collections/rangs_collection.js";
import { UserRangService } from "../services/user_rang/user_rang_service.js";
import { UserRangMapper } from "../mappers/user_rang/user_rang_mapper.js";

export class RangFacade {
    /**
     * Строит модель из объекта
     * @param {Array} params
     * @returns {Rang}
     */
    static buildFromArr(params) {
        return new Rang(
            params.id || 0,
            params.name || '',
            params.thumbnailUrl || '',
            params.orderNumber || 0
        );
    }

    /**
     * Обновляет ранг в БД
     * @param {Rang} rang 
     * @returns {int}
     */
    static update(rang) {
        const service = new RangService(
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
        const service = new RangService(
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
     * @param {int} limit
     * @returns {RangsCollection}
     */getRang
    static findAll(limit = -1) {
        const service = new RangService(
            new RangMapper()
        );

        try {
            return service.findAll(limit);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Создает ранг
     * @param {Rang} rang
     * @returns {int}
     */
    static create(rang) {
        const service = new RangService(
            new RangMapper()
        );

        try {
            return service.create(rang);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаляет ранг
     * @param {int} id 
     * @returns {int}
     */
    static delete(id) {
        const service = new RangService(
            new RangMapper()
        );

        try {
            return service.delete(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Позвращает ID ранга пользователя
     * @param {int} userId
     * @returns {int}
     */
    static getUserRangId(userId) {
        const service = new UserRangService(
            new UserRangMapper()
        );

        try {
            return service.getRang(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}