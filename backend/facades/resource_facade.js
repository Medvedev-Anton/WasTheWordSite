import ResourcesMapper from "../mappers/resources/resources_mapper.js";
import ResourcesService from "../services/resources/resources_service.js";
import { db } from "../database/init.js";
import { BalanceFacade } from "./balance_facade.js";
import { OrgsFacade } from "./orgs_facade.js";
import OrgsResourcesFacade from "./orgs_resources_facade.js";

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

    /**
     * Получает ресурс по ID
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
     * Добыча ресурса организацией
     * @param {number} orgId
     * @param {number} resourceId
     */
    static extract(orgId, resourceId) {
        const transaction = db.transaction(() => {
            try {
                const orgBalance = BalanceFacade.entity('orgs').getBalance(orgId);
                const orgEnergy = OrgsFacade.getOrgEnergy(orgId);

                const resource = this.getById(resourceId);
                const countNeedMoney = resource.countNeedMoney;
                const countNeedEnergy = resource.countNeedEnergy;

                if (orgBalance < countNeedMoney || orgEnergy < countNeedEnergy) {
                    throw new Error('Не хватает денег или энергии для добычи ресурса');
                }

                BalanceFacade.entity('orgs').decrement(orgId, countNeedMoney);
                OrgsFacade.decrementOrgEnergy(orgId, countNeedEnergy);

                OrgsResourcesFacade.createOrIncrement(orgId, resourceId);
            }
            catch (e) {
                throw new Error(e.message);
            }
        });

        try {
            transaction();
        }
        catch (e) {
            throw new Error('Ошибка при обработке транзакции добычи ресурса: ' + e.message);
        }
    }
}