import ResourcesServiceInterface from "./resources_service_interface.js";
import { fileURLToPath } from 'url';
import fs from 'fs';

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

    create(number, name, imageUrl, countNeedEnergy, countNeedMoney) {
        try {
            return this.mapper.create(number, name, imageUrl, countNeedEnergy, countNeedMoney);
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

    updateNumber(id, newNumber) {
        try {
            return this.mapper.updateNumber(id, newNumber);
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

    getById(id) {
        try {
            return this.mapper.getById(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    deleteImage(id) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        try {
            const resource = this.getById(id);

            if (resource === null) {
                throw new Error('Не найден ресурс с ID: ' + id);
            }

            const imageUrl = resource.imageUrl;

            const filePath = path.join(__dirname, '../..', imageUrl.replace(/^\//, ''));
            
            if (fs.existsSync(filePath)) {
                try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}