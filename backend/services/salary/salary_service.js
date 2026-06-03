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

    getOrgSalariesWithNames(orgId) {
        try {
            return this.mapper.getOrgSalariesWithNames(orgId);
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

    updateSalary(userId, orgId, newSalary) {
        try {
            return this.mapper.updateSalary(userId, orgId, newSalary);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    changePaydayToNextMonth(userId, orgId, payday) {
        try {
            const date = new Date(payday);
            date.setMonth(date.getMonth() + 1);
            
            return this.mapper.changePayday(userId, orgId, date.toString());
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}