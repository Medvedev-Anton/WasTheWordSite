export default class NotificationsService extends NotificationsServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    create(userId, message) {
        try {
            return this.mapper.create(userId, message);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getAllByUser(userId) {
        try {
            return this.mapper.getAllByUser(userId);
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
} 