import { LoansServiceInterface } from "./loans_service_interface.js";

export class LoansService extends LoansServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getAllBorrowersByCreditor(creditorId) {
        try {
            return this.mapper.getAllBorrowersByCreditor(creditorId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    calcFinalSum(sum, percents, days) {
        return sum * (1 + (percents * days) / 100);
    }

    calcDailyPayment(sum, days) {
        if (days === 0) {
            return 0;
        }

        return sum / days;
    }

    createLoan(creditorId, borrowerId, startSum, paymentSum) {
        try {
            return this.mapper.insertLoanData(creditorId, borrowerId, startSum, paymentSum);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}