import OrgsSimpleItemsServiceInterface from "./orgs_simple_items_service_interface.js";

export default class OrgsSimpleItemsService extends OrgsSimpleItemsServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    create(orgId, simpleItemId, count) {
        try {
            return this.mapper.create(orgId, simpleItemId, count);
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

    getById(id) {
        try {
            return this.mapper.findById(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getAllByOrgId(orgId) {
        try {
            return this.mapper.findAllByOrgId(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getByOrgAndSimpleItem(orgId, simpleItemId) {
        try {
            return this.mapper.findByOrgAndSimpleItem(orgId, simpleItemId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    increment(id, incrementValue) {
        try {
            return this.mapper.increment(id, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    createOrIncrement(orgId, simpleItemId) {
        try {
            const simpleItem = this.getByOrgAndSimpleItem(orgId, simpleItemId);

            if (simpleItem === null) {
                this.create(orgId, simpleItemId, 1);
            }
            else {
                this.increment(simpleItem.id, 1);
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}