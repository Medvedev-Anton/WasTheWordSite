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
            return this.mapper.findAllByOrgId(orgId);
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

    decrement(id, decrementValue) {
        try {
            return this.mapper.decrement(id, decrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    createOrIncrement(orgId, simpleItemId, incrementValue = 1) {
        try {
            const simpleItem = this.getByOrgAndSimpleItem(orgId, simpleItemId);

            if (simpleItem === null) {
                this.create(orgId, simpleItemId, incrementValue);
            }
            else {
                this.increment(simpleItem.id, incrementValue);
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    getOrgSimpleItemCount(orgId, simpleItemId) {
        try {
            return this.mapper.findCountByOrgAndSimpleItem(orgId, simpleItemId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateOrgSimpleItemPrice(orgId, simpleItemId, newPrice) {
        try {
            return this.mapper.updatePriceByOrgAndSimpleItem(orgId, simpleItemId, newPrice);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}