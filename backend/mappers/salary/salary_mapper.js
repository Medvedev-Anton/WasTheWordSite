import { SalaryMapperInterface } from "./salary_mapper_interface.js";
import { db } from "../../database/init.js";

export class SalaryMapper extends SalaryMapperInterface {
    constructor() {
        super();
    }

    getAll() {
        const result = db.prepare(`
            SELECT
                *
            FROM
                users_salary    
        `).all();

        return result;
    }

    getOrgSalariesWithNames() {
        const result = db.prepare(`
            SELECT
                u.username,
                s.*
            FROM
                users_salary s
            JOIN
                users u
            ON
                s.userId = u.id                
        `).all();

        return result;
    }

    getUserSalaryies(userId) {
        const salaries = db.prepare(`
            SELECT
                *
            FROM 
                users_salary
            WHERE
                userId = ?
        `).all(userId);

        return salaries;
    }

    create(userId, orgId, salary, payday) {
        db.prepare(`
            INSERT INTO
                users_salary(userId, orgId, salary, payday)
            VALUES(?, ?, ?, ?)    
        `).run(userId, orgId, salary, payday);
    }

    delete(userId, orgId) {
        db.prepare(`
            DELETE FROM
                users_salary
            WHERE
                userId = ?
                AND
                orgId = ?    
        `).run(userId, orgId);
    }
}