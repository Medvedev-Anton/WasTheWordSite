import ResourcesServiceInterface from "./resources_service_interface.js";

export default class ResourcesService extends ResourcesServiceInterface {
    constructor(mapper) {
        super(mapper);
    }

    getAll() {
        try {
            return this.mapper.findAll();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    create(name, imageUrl, countNeedEnergy, countNeedMoney) {
        try {
            return this.mapper.create(name, imageUrl, countNeedEnergy, countNeedMoney);
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

    updateName(id, newName) {
        try {
            return this.mapper.updateName(id, newName);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateImageUrl(id, newImageUrl) {
        try {
            return this.mapper.updateImageUrl(id, newImageUrl);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateNeedEnergy(id, newEnergy) {
        try {
            return this.mapper.updateNeedEnergy(id, newEnergy);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateNeedMoney(id, newMoney) {
        try {
            return this.mapper.updateNeedMoney(id, newMoney);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}