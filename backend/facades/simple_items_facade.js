import SimpleItemsMapper from "../mappers/simple_items/simple_items_mapper.js";
import SimpleItemsService from "../services/simple_items/simple_items_service.js";

export default class SimpleItemsFacade {
    static getService() {
        return new SimpleItemsService(
            new SimpleItemsMapper()
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
     * @param {number} countNeedEnergy
     * @param {number} countNeedMoney
     * @param {number} resourceId
     * @param {number} countNeedResource
     */
    static create(number, name, imageUrl, countNeedEnergy, countNeedMoney, resourceId, countNeedResource) {
        try {
            return this.getService().create(number, name, imageUrl, countNeedEnergy, countNeedMoney, resourceId, countNeedResource);
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
     * Обновление требуемого количества энергии
     * @param {number} id
     * @param {number} newEnergy
     */
    static updateNeedEnergy(id, newEnergy) {
        try {
            return this.getService().updateNeedEnergy(id, newEnergy);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновление требуемого количества денег
     * @param {number} id
     * @param {number} newMoney
     */
    static updateNeedMoney(id, newMoney) {
        try {
            return this.getService().updateNeedMoney(id, newMoney);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновление ID требуемого ресурса
     * @param {number} id
     * @param {number} newResourceId
     */
    static updateNeedResourceId(id, newResourceId) {
        try {
            return this.getService().updateNeedResourceId(id, newResourceId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновление количества требуемого ресурса
     * @param {number} id
     * @param {number} newResourceCount
     */
    static updateCountNeedResource(id, newResourceCount) {
        try {
            return this.getService().updateCountNeedResource(id, newResourceCount);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Возвращает данные предмета по id
     * @param {number} id
     */
    static getById(id) {
        try {
            return this.getService().getById(id);
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