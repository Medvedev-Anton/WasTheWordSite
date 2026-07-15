import UsersSimpleItemsMapper from "../mappers/users_simple_items/users_simple_items_mapper.js";
import UsersSimpleItemsService from "../services/users_simple_items/users_simple_items_service.js";

export default class UsersSimpleItemsFacade {
    static getService() {
        return new UsersSimpleItemsService(
            new UsersSimpleItemsMapper()
        );
    }

    /**
     * Создание записи
     * @param {number} userId
     * @param {number} simpleItemId
     * @param {number} count
     */
    static create(userId, simpleItemId, count) {
        try {
            return this.getService().create(userId, simpleItemId, count);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаление записи
     * @param {number} id
     */
    static delete(id) {
        try {
            return this.getService().delete(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получение всех предметов пользователя
     * @param {number} userId
     */
    static getAllByUserId(userId) {
        try {
            return this.getService().getAllByUserId(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получение по пользователю и предмету
     * @param {number} userId
     * @param {number} simpleItemId
     */
    static getByUserAndSimpleItem(userId, simpleItemId) {
        try {
            return this.getService().getByUserAndSimpleItem(userId, simpleItemId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Создание или инкрементирование
     * @param {number} userId
     * @param {number} simpleItemId
     * @param {number} incrementValue
     */
    static createOrIncrement(userId, simpleItemId, incrementValue = 1) {
        try {
            return this.getService().createOrIncrement(userId, simpleItemId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}