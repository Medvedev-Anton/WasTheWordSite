export class LoansMapperInterface {
    constructor(tableName) {
        if (new.target === 'LoansMapperInterface') {
            throw new Error('Нельзя создать экзмепляр класса LoansMapperInterface');
        }

        this.tableName = tableName;
    }

    /**
     * Получить ID всех заемщиков кредитора
     * @param {int} creditorId
     */
    getAllBorrowersByCreditor(creditorId) {
        throw new Error('getAllBorrowersByCreditor должен быть переопределен в наследнике');
    }
}