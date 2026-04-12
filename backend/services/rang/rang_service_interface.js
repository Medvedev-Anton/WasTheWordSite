import { RangsCollection } from "../../collections/rangs_collection";
import { RangMapper } from "../../mappers/rang/rang_mapper";
import { Rang } from "../../models/rang";

export class RangServiceInterface {
    /**
     * @param {RangMapper} mapper 
     */
    constructor(mapper) {
        this.mapper = mapper;
    }

    /**
     * Обновляет ранг в БД
     * @param {Rang} rang 
     * @returns {int}
     */
    update(rang) {
        throw new Error('update должен быть переопределен в наследнике');
    }

    /**
     * Получает ранг по ID
     * @param {int} id
     * @returns {Rang}
     */
    findById(id) {
        throw new Error('findById должен быть переопределен в наследнике');
    }

    /**
     * Получает все ранги
     * @params {int} limit
     * @returns {RangsCollection}
     */
    findAll(limit = -1) {
        throw new Error('findAll должен быть переопределен в наследнике');
    }
}