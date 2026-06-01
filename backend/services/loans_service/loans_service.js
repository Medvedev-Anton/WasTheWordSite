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

    createLoan(creditorId, borrowerId, startSum, sumToPay, paymentSum) {
        try {
            return this.mapper.insertLoanData(creditorId, borrowerId, startSum, sumToPay, paymentSum);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    decrementLoanSum(entityId) {
        try {
            return this.mapper.decrementLoanSum(entityId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getPaymentSum(entityId) {
        try {
            return this.mapper.getPaymentSum(entityId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getCurrentSum(entityId) {
        try {
            return this.mapper.getCurrentSum(entityId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    delete(entityId, bankId) {
        try {
            return this.mapper.delete(entityId, bankId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    isEntityLoanExists(userId) {
        try {
            return this.mapper.isEntityLoanExists(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}