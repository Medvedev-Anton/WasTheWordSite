import CompoundItemsMapper from "../mappers/compound_items/compound_items_mapper.js";
import CompoundItemsService from "../services/compound_items/compound_items_service.js";

export default class CompoundItemsFacade {
    static getService() {
        return new CompoundItemsService(
            new CompoundItemsMapper()
        )
    }

    /**
     * Возвращает все предметы
     */
    static getAll() {
        try {
            return this.getService().getAll();
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Создание предмета
     * @param {number} id
     * @param {string} name
     * @param {string} imageUrl
     * @param {number} number
     * @param {Array<Record<string, number>>} itemsParts
     */
    static create(number, name, imageUrl, itemsParts) {
        try {
            return this.getService().create(number, name, imageUrl, itemsParts);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаление предмета
     * @param {number} id
     */
    static delete(id) {
        try {
            return this.getService().delete(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновление номера предмета
     * @param {number} id
     * @param {number} newNumber
     */
    static updateNumber(id, newNumber) {
        try {
            return this.getService().updateNumber(id, newNumber);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновление названия
     * @param {number} id
     * @param {string} newName
     */
    static updateName(id, newName) {
        try {
            return this.getService().updateName(id, newName);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновление изображения
     * @param {number} id
     * @param {string} newImageUrl
     */
    static updateImageUrl(id, newImageUrl) {
        try {
            return this.getService().updateImageUrl(id, newImageUrl);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Создание части предмета
     * @param {number} compoundItemId
     * @param {number} partItemId
     * @param {number} countNeed
     */
    static createPart(compoundItemId, partItemId, countNeed) {
        try {
            return this.getService().createPart(compoundItemId, partItemId, countNeed);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаление части предмета
     * @param {number} partId
     */
    static deletePart(partId) {
        try {
            return this.getService().deletePart(partId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновление необходимого количества части предмета
     * @param {number} partId
     * @param {number} newValue
     */
    static updatePartNeedCount(partId, newValue) {
        try {
            return this.getService().updatePartNeedCount(partId, newValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаляет изображение предмета
     * @param {number} id 
     */
    static deleteImage(id) {
        try {
            return this.getService().deleteImage(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}