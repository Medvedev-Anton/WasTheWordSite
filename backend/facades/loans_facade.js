import { LoansOrgsMapper } from "../mappers/loans/loans_orgs_mapper.js";
import { LoansUsersMapper } from "../mappers/loans/loans_users_mapper.js";
import { LoansService } from "../services/loans_service/loans_service.js";

export class LoansFacade {
    constructor(entity) {
        if (entity === 'users') {
            this.service = new LoansService(
                new LoansUsersMapper()
            );
        }
        else if (entity === 'orgs') {
            this.service = new LoansService(
                new LoansOrgsMapper()
            );
        }
        else {
            throw new Error('Неизвестная сущность заемщика: ' + entity);
        }
    }

    static entity(entity) {
        return new this(entity);
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