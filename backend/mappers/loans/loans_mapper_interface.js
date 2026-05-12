export class LoansMapperInterface {
    constructor() {
        if (new.target === 'LoansMapperInterface') {
            throw new Error('Нельзя создать экзмепляр класса LoansMapperInterface');
        }
    }

    /**
     * Получить данные всех заемщиков кредитора
     * @param {int} creditorId
     */
    getAllBorrowersByCreditor(creditorId) {
        throw new Error('getAllBorrowersByCreditor должен быть переопределен в наследнике');
    }
}