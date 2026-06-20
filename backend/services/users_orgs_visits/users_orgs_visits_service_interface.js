import UsersOrgsVisitsMapperInterface from "../../mappers/users_orgs_visits/users_orgs_visits_mapper_interface.js";

export default class UsersOrgsVisitsServiceInterface {
    /**
     * @param {UsersOrgsVisitsMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'UsersOrgsVisitsServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса UsersOrgsVisitsServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Создание записи о посещении
     * @param {number} userId
     * @param {number} orgId
     */
    create(userId, orgId) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Получение записи о посещении
     * @param {number} userId
     * @param {number} orgId
     */
    get(userId, orgId) {
        throw new Error('get должен быть переопределен в наследнике');
    }
}