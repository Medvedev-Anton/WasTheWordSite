import UsersResourcesServiceInterface from "./users_resources_service_interface.js";

export default class UsersResourcesService extends UsersResourcesServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    create(userId, resourceId, count) {
        try {
            return this.mapper.create(userId, resourceId, count);
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

    updateUserResourcePrice(userId, resourceId, newPrice) {
        try {
            return this.mapper.updatePrice(userId, resourceId, newPrice);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getByUserAndResource(userId, resourceId) {
        try {
            return this.mapper.findByUserAndResource(userId, resourceId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    createOrIncrement(userId, resourceId, incrementValue = 1) {
        try {
            const resource = this.getByUserAndResource(userId, resourceId);

            if (resource === null) {
                this.create(userId, resourceId, incrementValue);
            }
            else {
                this.mapper.incrementUserResource(userId, resourceId, incrementValue);
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}