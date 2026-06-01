import NotificationsMapper from "../mappers/notifications/notifications_mapper.js";
import NotificationsService from "../services/notifications/notifications_service.js";

export default class NotificationsFacade {
    static getService() {
        return new NotificationsService(
            new NotificationsMapper()
        );
    }

    /**
     * Создать запись об уведомлении
     * @param {number} userId
     * @param {string} message
     */
    static create(userId, message) {
        try {
            return this.getService().create(userId, message);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получить все уведомления пользователя
     * @param {number} userId
     */
    static getAllByUser(userId) {
        try {
            return this.getService().getAllByUser(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаляет уведомление
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
}