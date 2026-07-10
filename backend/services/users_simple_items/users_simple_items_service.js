import UsersSimpleItemsServiceInterface from "./users_simple_items_service_interface.js";

export default class UsersSimpleItemsService extends UsersSimpleItemsServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    create(userId, simpleItemId, count) {
        try {
            return this.mapper.create(userId, simpleItemId, count);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    delete(id) {
        try {
            return this.mapper.delete(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getAllByUserId(userId) {
        try {
            return this.mapper.getAllByUserId(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}