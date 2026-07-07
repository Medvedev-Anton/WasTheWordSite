import OrgsResourcesServiceInterface from "./orgs_resources_service_interface.js";

export default class OrgsResourcesService extends OrgsResourcesServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    create(orgId, resourceId, count) {
        try {
            return this.mapper.create(orgId, resourceId, count);
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

    getByOrgAndResource(orgId, resourceId) {
        try {
            return this.mapper.findByOrgAndResource(orgId, resourceId);
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

    createOrIncrement(orgId, resourceId) {
        try {
            const resource = this.getByOrgAndResource(orgId, resourceId);

            if (resource === null) {
                this.create(orgId, resourceId, 1);
            }
            else {
                this.increment(resource.id, 1);
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}