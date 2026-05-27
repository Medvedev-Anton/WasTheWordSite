export class LoansMapperInterface {
    constructor() {
        if (new.target === 'LoansMapperInterface') {
            throw new Error('Нельзя создать экзмепляр класса LoansMapperInterface');
        }
    }

    /**
     * Получить данные всех заемщиков кредитора
     * @param {number} creditorId
     */
    getAllBorrowersByCreditor(creditorId) {
        throw new Error('getAllBorrowersByCreditor должен быть переопределен в наследнике');
    }

    /**
     * Создать данные о кредите
     * @param {number} creditorId
     * @param {number} borrowerId
     * @param {number} startSum
     */
    insertLoanData(creditorId, borrowerId, startSum) {
        throw new Error('insertLoanData должен быть переопределен в наследнике');
    }
}