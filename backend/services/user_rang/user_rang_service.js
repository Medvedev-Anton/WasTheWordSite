import { UserRangServiceInterface } from "./user_rang_service_interface.js";

export class UserRangService extends UserRangServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getRang(userId) {
        try {
            return this.mapper.getRang(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}