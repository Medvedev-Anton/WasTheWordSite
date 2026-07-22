import OrgsStoragesServiceInterface from "./orgs_storages_service_interface.js";

export default class OrgsStoragesService extends OrgsStoragesServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    createContentWithResource(orgId, resourceId, count) {
        try {
            return this.mapper.createContentWithResource(orgId, resourceId, count);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    createContentWithSimpleItem(orgId, simpleItemId, count) {
        try {
            return this.mapper.createContentWithSimpleItem(orgId, simpleItemId, count);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    createContentWithCompoundItem(orgId, compoundItemId, count) {
        try {
            return this.mapper.createContentWithCompoundItem(orgId, compoundItemId, count);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    deleteContentById(id) {
        try {
            return this.mapper.deleteContentById(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    findContentById(id) {
        try {
            return this.mapper.findContentById(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    findAllResourcesByOrgId(orgId) {
        try {
            return this.mapper.findAllResourcesByOrgId(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    findAllSimpleItemsByOrgId(orgId) {
        try {
            return this.mapper.findAllSimpleItemsByOrgId(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    findAllCompoundItemsByOrgId(orgId) {
        try {
            return this.mapper.findAllCompoundItemsByOrgId(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    findContentByOrgAndResource(orgId, resourceId) {
        try {
            return this.mapper.findContentByOrgAndResource(orgId, resourceId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    findContentByOrgAndSimpleItem(orgId, simpleItemId) {
        try {
            return this.mapper.findContentByOrgAndSimpleItem(orgId, simpleItemId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    findContentByOrgAndCompoundItem(orgId, compoundItemId) {
        try {
            return this.mapper.findContentByOrgAndCompoundItem(orgId, compoundItemId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    incrementOrgResource(orgId, resourceId, incrementValue) {
        try {
            return this.mapper.incrementOrgResource(orgId, resourceId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    incrementOrgSimpleItem(orgId, simpleItemId, incrementValue) {
        try {
            return this.mapper.incrementOrgSimpleItem(orgId, simpleItemId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    incrementOrgCompoundItem(orgId, compoundItemId, incrementValue) {
        try {
            return this.mapper.incrementOrgCompoundItem(orgId, compoundItemId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    decrementOrgResource(orgId, resourceId, decrementValue) {
        try {
            return this.mapper.decrementOrgResource(orgId, resourceId, decrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    decrementOrgSimpleItem(orgId, simpleItemId, decrementValue) {
        try {
            return this.mapper.decrementOrgSimpleItem(orgId, simpleItemId, decrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    decrementOrgCompoundItem(orgId, compoundItemId, decrementValue) {
        try {
            return this.mapper.decrementOrgCompoundItem(orgId, compoundItemId, decrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updatePriceByOrgAndResource(orgId, resourceId, newPrice) {
        try {
            return this.mapper.updatePriceByOrgAndResource(orgId, resourceId, newPrice);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updatePriceByOrgAndSimpleItem(orgId, simpleItemId, newPrice) {
        try {
            return this.mapper.updatePriceByOrgAndSimpleItem(orgId, simpleItemId, newPrice);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
    
    updatePriceByOrgAndCompoundItem(orgId, compoundItemId, newPrice) {
        try {
            return this.mapper.updatePriceByOrgAndCompoundItem(orgId, compoundItemId, newPrice);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    createNewStorageMember(storageId, memberOrgId) {
        try {
            return this.mapper.createNewStorageMember(storageId, memberOrgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    createOrIncrementOrgResource(orgId, resourceId, incrementValue = 1) {
        try {
            const resource = this.findContentByOrgAndResource(orgId, resourceId);

            if (resource === null) {
                this.createContentWithResource(orgId, resourceId, incrementValue);
            }
            else {
                this.incrementOrgResource(orgId, resourceId, incrementValue);
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    createOrIncrementOrgSimpleItem(orgId, simpleItemId, incrementValue = 1) {
        try {
            const simpleItem = this.findContentByOrgAndSimpleItem(orgId, simpleItemId);

            if (simpleItem === null) {
                this.createContentWithSimpleItem(orgId, simpleItemId, incrementValue);
            }
            else {
                this.incrementOrgSimpleItem(orgId, simpleItemId, incrementValue);
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    createOrIncrementOrgCompoundItem(orgId, compoundItemId, incrementValue = 1) {
        try {
            const compoundItem = this.findContentByOrgAndCompoundItem(orgId, compoundItemId);

            if (compoundItem === null) {
                this.createContentWithCompoundItem(orgId, compoundItemId, incrementValue);
            }
            else {
                this.incrementOrgCompoundItem(orgId, compoundItemId, incrementValue);
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    createNewStorage(ownerOrgId) {
        try {
            return this.mapper.createNewStorage(ownerOrgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    findStorageByOwner(ownerOrgId) {
        try {
            return this.mapper.findStorageByOwner(ownerOrgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}