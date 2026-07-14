import SimpleItemsMapper from "../mappers/simple_items/simple_items_mapper.js";
import SimpleItemsService from "../services/simple_items/simple_items_service.js";
import { db } from "../database/init.js";
import { BalanceFacade } from "./balance_facade.js";
import { OrgsFacade } from "./orgs_facade.js";
import OrgsResourcesFacade from "./orgs_resources_facade.js";
import EnergyFacade from "./energy_facade.js";
import OrgsSimpleItemsFacade from "./orgs_simple_items_facade.js";
import WorkshopsSimpleItemsFacade from "./workshops_simple_items_facade.js";

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

    /**
     * Создание простого предмета организацией
     * @param {number} orgId
     * @param {number} simpleItemId
     */
    static workshopCreate(orgId, simpleItemId) {
        const transaction = db.transaction(() => {
            try {
                const simpleItemData = this.getById(simpleItemId);

                if (simpleItemData === null) {
                    throw new Error('Не найден простой предмет с ID: ' + simpleItemId);
                }

                const needResourceId = simpleItemData.needResourceId;

                const orgBalance = BalanceFacade.entity('orgs').getBalance(orgId);
                const orgEnergy = OrgsFacade.getOrgEnergy(orgId);
                let orgResourceCount = 0;

                const orgResource = OrgsResourcesFacade.getByOrgAndResource(orgId, needResourceId);
                
                if (orgResource !== null) {
                    orgResourceCount = orgResource.count;
                }
                
                const countNeedMoney = simpleItemData.countNeedMoney;
                const countNeedEnergy = simpleItemData.countNeedEnergy;
                const countNeedResource = simpleItemData.countNeedResource;

                if (
                    orgBalance < countNeedMoney ||
                    orgEnergy < countNeedEnergy ||
                    orgResourceCount < countNeedResource
                ) {
                    throw new Error('Не хватает ресурсов для создания');
                }

                BalanceFacade.entity('orgs').decrement(orgId, countNeedMoney);
                EnergyFacade.entity('orgs').decrement(orgId, countNeedEnergy);
                OrgsResourcesFacade.decrementOrgResource(orgId, needResourceId, countNeedResource);

                const parentId = OrgsFacade.getParentId(orgId);
                OrgsSimpleItemsFacade.createOrIncrement(parentId, simpleItemId);
                WorkshopsSimpleItemsFacade.incrementCountCreated(orgId, 1);
            }
            catch (e) {
                throw new Error(e.message);
            }
        });

        try {
            transaction();
        }
        catch (e) {
            throw new Error('Ошибка при обработке транзакции создания простого предмета: ' + e.message);
        }
    }
    
    /**
     * Покупка простого предмета организацией у организации
     * @param {number} sellerId 
     * @param {number} buyerId 
     * @param {number} simpleItemId 
     * @param {number} simpleItemCount 
     */
    static buyOrgFromOrg(sellerId, buyerId, simpleItemId, simpleItemCount) {
        const transaction = db.transaction(() => {
            try {
                const simpleItem = OrgsSimpleItemsFacade.getByOrgAndSimpleItem(sellerId, simpleItemId);

                if (simpleItem === null) {
                    throw new Error(`У организации-продавца ${sellerId} нет предмета ${simpleItemId}`);
                }

                const sellerSimpleItemCount = parseInt(simpleItem.count);

                if (sellerSimpleItemCount < simpleItemCount) {
                    throw new Error(`У организации-продавца ${sellerId} нет предмета ${simpleItemId} в нужном количестве ${simpleItemCount}`);
                }

                const sellerSimpleItemPrice = parseInt(simpleItem.price);
                const totalPrice = simpleItemCount * sellerSimpleItemPrice;

                const balanceManager = BalanceFacade.entity('orgs');

                const buyerBalance = balanceManager.getBalance(buyerId);

                if (buyerBalance < totalPrice) {
                    throw new Error(`У покупателя ${buyerId} не хватает средств для покупки предмета ${simpleItemId} у продавца ${sellerId}`);
                }

                OrgsSimpleItemsFacade.decrement(simpleItem.id, simpleItemCount);
                OrgsSimpleItemsFacade.createOrIncrement(buyerId, simpleItemId, simpleItemCount);
                balanceManager.decrement(buyerId, totalPrice);

                const sellerOrgType = OrgsFacade.getOrgType(sellerId);
                ProfitFacade.entity('orgs').orgType(sellerOrgType).processWithTax(sellerId, totalPrice);
            }
            catch (e) {
                throw new Error(e.message);
            }
        });

        try {
            transaction();
        }
        catch (e) {
            throw new Error(`Ошибка при обработке транзакции покупки предмета организации ${buyerId} у организации ${sellerId} предмета: ` + e.message);
        }
    }
}