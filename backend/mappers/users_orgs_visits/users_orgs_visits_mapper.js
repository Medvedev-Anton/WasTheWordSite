import UsersOrgsVisitsMapperInterface from "./users_orgs_visits_mapper_interface.js";
import { db } from "../../database/init.js";

export default class UsersOrgsVisitsMapper extends UsersOrgsVisitsMapperInterface {
    constructor() {
        super();
    }

    create(userId, orgId) {
        db.prepare(`
            INSERT INTO users_orgs_visits(userId, orgId)
            VALUES(?, ?)
        `).run(userId, orgId);
    }

    find(userId, orgId) {
        const result = db.prepare(`
            SELECT
                *
            FROM
                users_orgs_visits
            WHERE
                userId = ?
                AND
                orgId = ?
        `).get(userId, orgId);

        return result || null;
    }
}