import UsersResourcesServiceInterface from "./users_resources_service_interface.js";

export default class UsersResourcesService extends UsersResourcesServiceInterface {
    constructor(mapper) {
        this.mapper = mapper;
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
}