import NotificationsMapperInterface from "../../mappers/notifications/notifications_mapper_interface.js";

export default class NotificationsServiceInterface {
    /**
     * @param {NotificationsMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'NotificationsServiceInterface') {
            throw new Error('Нельзя создат экземпляр класса NotificationsServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Создать запись об уведомлении
     * @param {number} userId
     * @param {string} message
     */
    create(userId, message) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Получить все уведомления пользователя
     * @param {number} userId
     */
    getAllByUser(userId) {
        throw new Error('getAllByUser должен быть переопределен в наследнике');
    }

    /**
     * Удаляет уведомление
     * @param {number} id
     */
    delete(id) {
        throw new Error('getAllByUser должен быть переопределен в наследнике');
    }
}