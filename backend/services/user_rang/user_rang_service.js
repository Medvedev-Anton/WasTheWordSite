import { RangFacade } from "../../facades/rang_facade.js";
import { UserRangServiceInterface } from "./user_rang_service_interface.js";

export class UserRangService extends UserRangServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getRang(userId) {
        try {
            const rangId = this.mapper.getRang(userId);

            if (isNaN(rangId)) {
                return RangFacade.findByOrderNumber(0).getId();
            }

            return rangId;
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    setRang(rangId, userId) {
        try {
            return this.mapper.setRang(rangId, userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}