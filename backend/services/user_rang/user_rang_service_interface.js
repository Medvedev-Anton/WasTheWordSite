import { UserRangMapperInterface } from "../../mappers/user_rang/user_rang_mapper_interface.js";

export class UserRangServiceInterface {
    /**
     * @param {UserRangMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'UserRangServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса UserRangServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Возвращает ранг пользователя
     * @param {int} userId 
     */
    getRang(userId) {
        throw new Error('getRang должен быть переопределен в наследнике');
    }

    /**
     * Устанавливает ранг пользователю
     * @param {int} rangId
     * @param {int} userId
     */
    setRang(rangId, userId) {
        throw new Error('setRang должен быть переопределен в наследнике');
    }
}