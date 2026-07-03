import ResourcesMapper from "../mappers/resources/resources_mapper.js";
import ResourcesService from "../services/resources/resources_service.js";

export default class ResourceFacade {
    static getService() {
        return new ResourcesService(
            new ResourcesMapper()
        )
    }

    /**
     * Возвращает все ресурсы
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
     * Создание ресурса
     * @param {number} number
     * @param {string} name
     * @param {string} imageUrl
     * @param {number} countNeedEnergy
     * @param {number} countNeedMoney
     */
    static create(number, name, imageUrl, countNeedEnergy, countNeedMoney) {
        try {
            return this.getService().create(number, name, imageUrl, countNeedEnergy, countNeedMoney);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаление ресурса
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
     * Обновление номера ресурса
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
     * Удаляет изображение ресурса
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