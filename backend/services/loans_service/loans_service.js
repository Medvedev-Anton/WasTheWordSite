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
}