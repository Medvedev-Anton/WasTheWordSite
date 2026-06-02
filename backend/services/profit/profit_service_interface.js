import { ProfitMapperInterface } from "../../mappers/profit/profit_mapper_interface.js";

export class ProfitServiceInterface {
    /**
     * @param {ProfitMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'ProfitServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса ProfitServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Создает запись о доходе
     * @param {int} entityId
     * @param {int} incomingSum
     * @return {int}
     */
    create(entityId, incomingSum) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Возвращает сумму доходов сущности за указанный период
     * @param {int} entityId
     * @param {string} dateStart
     * @param {string} dateFinish
     * @return {int}
     */
    getSumInDateInterval(entityId, dateStart, dateFinish) {
        throw new Error('getSumInDateInterval должен быть переопределен в наследнике');
    }
}