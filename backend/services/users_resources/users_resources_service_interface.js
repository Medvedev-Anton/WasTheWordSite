import UsersResourcesMapperInterface from "../../mappers/users_resources/users_resources_mapper_interface.js";

export default class UsersResourcesServiceInterface {
    /**
     * @param {UsersResourcesMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'UsersResourcesServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса UsersResourcesServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Создание записи
     * @param {number} userId
     * @param {number} resourceId
     * @param {number} count
     */
    create(userId, resourceId, count) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Удаление записи
     * @param {number} id
     */
    delete(id) {
        throw new Error('delete должен быть переопределен в наследнике');
    }

    /**
     * Получение всех ресурсов пользователя
     * @param {number} userId
     */
    getAllByUserId(userId) {
        throw new Error('getAllByUserId должен быть переопределен в наследнике');
    }

    /**
     * Обновить цену ресурса
     * @param {number} userId
     * @param {number} resourceId
     * @param {number} newPrice
     */
    updateUserResourcePrice(userId, resourceId, newPrice) {
        throw new Error('updateUserResourcePrice должен быть переопределен в наследнике');
    }
}