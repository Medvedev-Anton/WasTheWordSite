import { MainCollection } from "../collections/main_collection.js";
import { Model } from "../models/model.js";

export class Mapper {
    constructor () {
        if (new.target === 'Mapper') {
            throw new Error('Нельзя создать экземпляр абстрактного класса Mapper');
        }
    }

    /**
     * Преобразует строку из БД в модель
     * @param {*} row 
     * @returns {Model}
     */
    rowMapper(row) {
        throw new Error('rowMapper должен быть переопределен в наследнике');
    }

    /**
     * Преобразует массив строк из БД в коллекцию моделей
     * @param {Array} rows
     * @return {MainCollection}
     */
    rowsArrayMapper(rows) {
        throw new Error('rowsArrayMapper должен быть переопределен в наследнике');
    }
}