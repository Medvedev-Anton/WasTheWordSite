import { BalanceMapperInterface } from "./balance_mapper_interface.js";
import { db } from "../../database/init.js";

export class BalanceUsersMapper extends BalanceMapperInterface {
    constructor() {
        super();
    }

    increment(userId, incrementValue) {
        if (isNaN(parseInt(userId))) {
            throw new Error('userId должен быть целочисленным');
        }

        if (userId < 0) {
            throw new Error('userId должен быть неотрицательным');
        }

        db.prepare(`
            UPDATE
                users
            SET
                balance = balance + ?
            WHERE
                id = ?    
        `).run(incrementValue, userId);
    }

    decrement(userId, decrementValue) {
        if (isNaN(parseInt(userId))) {
            throw new Error('userId должен быть целочисленным');
        }

        if (userId < 0) {
            throw new Error('userId должен быть неотрицательным');
        }

        db.prepare(`
            UPDATE
                users
            SET
                balance = balance - ?
            WHERE
                id = ?    
        `).run(decrementValue, userId);
    }
}