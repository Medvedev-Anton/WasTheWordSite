import { LoansMapper } from "../mappers/loans/loans_mapper.js";
import { LoansService } from "../services/loans_service/loans_service.js";

export class LoansFacade {
    constructor(entity) {
        if (entity === 'users') {
            this.service = new LoansService(
                new LoansMapper('users_loans')
            )
        }
        else if (entity === 'orgs') {
            this.service = new LoansService(
                new LoansMapper('orgs_loans')
            )
        }
        else {
            throw new Error('Неизвестная сущность заемщика: ' + entity);
        }
    }

    static entity(entity) {
        return new self(entity);
    }

    /**
     * Получить ID всех заемщиков кредитора
     * @param {int} creditorId
     */
    getAllBorrowersByCreditor(creditorId) {
        try {
            return this.service.getAllBorrowersByCreditor(creditorId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}