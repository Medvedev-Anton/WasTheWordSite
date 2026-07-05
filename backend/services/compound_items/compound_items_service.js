import CompoundItemsServiceInterface from "./compound_items_service_interface.js";
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

export default class CompoundItemsService extends CompoundItemsServiceInterface {
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

    create(number, name, imageUrl, itemsParts) {
        try {
            return this.mapper.create(number, name, imageUrl, itemsParts);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    delete(id) {
        try {
            this.deleteImage(id);
            return this.mapper.delete(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateNumber(id, newNumber) {
        try {
            return this.mapper.update(id, 'number', newNumber);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateName(id, newName) {
        try {
            return this.mapper.update(id, 'name', newName);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updateImageUrl(id, newImageUrl) {
        try {
            return this.mapper.update(id, 'imageUrl', newImageUrl);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    createPart(compoundItemId, partItemId, countNeed) {
        try {
            return this.mapper.createPart(compoundItemId, partItemId, countNeed);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    deletePart(partId) {
        try {
            return this.mapper.deletePart(partId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updatePartNeedCount(partId, newValue) {
        try {
            return this.mapper.updatePartNeedCount(partId, newValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    updatePartItemId(partId, partItemId) {
        try {
            return this.mapper.updatePartItemId(partId, partItemId);
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

    deleteImage(id) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        try {
            const item = this.getById(id);

            if (item === null) {
                throw new Error('Не найден составной предмет с ID: ' + id);
            }

            const imageUrl = item.imageUrl;

            if (imageUrl !== undefined) {
                const filePath = path.join(__dirname, '../..', imageUrl.replace(/^\//, ''));
            
                if (fs.existsSync(filePath)) {
                    try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
                }
            }            
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}