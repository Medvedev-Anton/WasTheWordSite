import UsersResourcesMapper from "../mappers/users_resources/users_resources_mapper.js";
import UsersResourcesService from "../services/users_resources/users_resources_service.js";

export default class UsersResourcesFacade {
    static getService() {
        return new UsersResourcesService(
            new UsersResourcesMapper()
        );
    }

    /**
     * Создание записи
     * @param {number} userId
     * @param {number} resourceId
     * @param {number} count
     */
    static create(userId, resourceId, count) {
        try {
            return this.getService().create(userId, resourceId, count);
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
     * Получение всех ресурсов пользователя
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
     * Обновить цену ресурса
     * @param {number} userId
     * @param {number} resourceId
     * @param {number} newPrice
     */
    static updateUserResourcePrice(userId, resourceId, newPrice) {
        try {
            return this.getService().updateUserResourcePrice(userId, resourceId, newPrice);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}