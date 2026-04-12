import { MainCollection } from "../collections/main_collection";
import { Model } from "../models/model";

export class Mapper {
    constructor () {
        throw new Error('Нельзя создать экземпляр абстрактного класса');
    }

    /**
     * Возвращает все элементы модели
     * @param {int} limit 
     * @returns {Model}
     */
    findAll(limit = -1) {
        throw new Error('findAll должен быть переопределен в наследнике');
    }

    /**
     * Возвращает модель по ID
     * @param {int} id 
     * @returns {Model}
     */
    findById(id) {
        throw new Error('findById должен быть переопределен в наследнике');
    }

    /**
     * Создает запись в бд
     * @param {Model} model
     * @returns {int}
     */
    create(model) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Обновляет запись в бд
     * @param {Model} model
     * @returns {int}
     */
    update(model) {
        throw new Error('update должен быть переопределен в наследнике');
    }

    /**
     * Удлаяет запись в бд
     * @param {int} id
     * @returns {int}
     */
    delete(id) {
        throw new Error('delete должен быть переопределен в наследнике');
    }

    /**
     * Преобразует строку из БД в модель
     * @param {*} row 
     */
    rowMapper(row) {
        throw new Error('rowMapper должен быть переопределен в наследнике');
    }

    /**
     * Преобразует массив строк из БД в коллекцию моделей
     * @param {MainCollection} rows 
     */
    rowsArrayMapper(rows) {
        throw new Error('rowsArrayMapper должен быть переопределен в наследнике');
    }
}