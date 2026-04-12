import { Rang } from '../../models/rang.js';
import { Mapper } from '../mapper.js';

export class RangMapperInterface extends Mapper {
    constructor () {
        throw new Error('Нельзя создать экземпляр абстрактного класса');
    }

    /**
     * Возвращает все элементы модели
     * @param {int} limit 
     * @returns {Rang}
     */
    findAll(limit = -1) {
        throw new Error('findAll должен быть переопределен в наследнике');
    }

    /**
     * Возвращает модель по ID
     * @param {int} id 
     * @returns {Rang}
     */
    findById(id) {
        throw new Error('findById должен быть переопределен в наследнике');
    }

    /**
     * Создает запись в бд
     * @param {Rang} rang
     * @returns {int}
     */
    create(rang) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Обновляет запись в бд
     * @param {Rang} rang
     * @returns {int}
     */
    update(rang) {
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
}