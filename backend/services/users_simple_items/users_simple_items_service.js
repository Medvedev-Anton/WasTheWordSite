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
            return this.mapper.findAllByUserId(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getByUserAndSimpleItem(userId, simpleItemId) {
        try {
            return this.mapper.findByUserAndSimpleItem(userId, simpleItemId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    createOrIncrement(userId, simpleItemId, incrementValue = 1) {
        try {
            const simpleItem = this.getByUserAndSimpleItem(userId, simpleItemId);

            if (simpleItem === null) {
                this.create(userId, simpleItemId, incrementValue);
            }
            else {
                this.increment(userId, simpleItemId, incrementValue);
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    increment(userId, simpleItemId, incrementValue) {
        try {
            return this.mapper.increment(userId, simpleItemId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}