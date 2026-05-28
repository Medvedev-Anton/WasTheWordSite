import { SalaryServiceInterface } from "./salary_service_interface.js";

export class SalaryService extends SalaryServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getAll() {
        try {
            return this.mapper.getAll();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getAllWithNames() {
        try {
            return this.mapper.getAllWithNames();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getUserSalaryies(userId) {
        try {
            return this.mapper.getUserSalaryies(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    create(userId, orgId, salary, payday) {
        try {
            return this.mapper.create(userId, orgId, salary, payday);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    delete(userId, orgId) {
        try {
            return this.mapper.delete(userId, orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}