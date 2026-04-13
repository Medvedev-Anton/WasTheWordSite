import { RangsCollection } from "../../collections/rangs_collection.js";
import { RangMapper } from "../../mappers/rang/rang_mapper.js";
import { Rang } from "../../models/rang.js";

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
     * @param {int} limit
     * @returns {RangsCollection}
     */
    findAll(limit = -1) {
        throw new Error('findAll должен быть переопределен в наследнике');
    }

    /**
     * Создает ранг
     * @param {Rang} rang
     * @returns {int}
     */
    create(rang) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Удаляет ранг
     * @param {int} id
     * @returns {int}
     */
    delete(id) {
        throw new Error('create должен быть переопределен в наследнике');
    }
}