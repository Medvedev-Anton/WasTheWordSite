import { MainCollection } from "../collections/main_collection";
import { Model } from "../models/model";

export class Mapper {
    constructor () {
        throw new Error('Нельзя создать экземпляр абстрактного класса');
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