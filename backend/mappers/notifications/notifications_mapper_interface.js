export default class NotificationsMapperInterface {
    constructor() {
        if (new.target === 'NotificationsMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса NotificationsMapperInterface');
        }
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