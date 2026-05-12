export class ProfitMapperInterface {
    constructor() {
        if (new.target === 'ProfitMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса ProfitMapperInterface');
        }
    }

    /**
     * Создает запись о доходе
     * @param {int} entityId
     * @param {int} incomingSum
     * @param {string} date
     * @return {int}
     */
    insert(entityId, incomingSum, date) {
        throw new Error('insert должен быть переопределен в наследнике');
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