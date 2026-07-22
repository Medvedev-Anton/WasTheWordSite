import OrgsStoragesMapper from "../mappers/orgs_storages/orgs_storages_mapper.js";
import OrgsStoragesService from "../services/orgs_storages/orgs_storages_service.js";

export default class OrgsStoragesFacade {
    static getService() {
        return new OrgsStoragesService(
            new OrgsStoragesMapper()
        );
    }

    /**
     * Создание записи с ресурсом
     * @param {number} orgId
     * @param {number} resourceId
     * @param {number} count
     */
    static createContentWithResource(orgId, resourceId, count) {
        try {
            return this.getService().createContentWithResource(orgId, resourceId, count);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Создание записи с простым предметом
     * @param {number} orgId
     * @param {number} simpleItemId
     * @param {number} count
     */
    static createContentWithSimpleItem(orgId, simpleItemId, count) {
        try {
            return this.getService().createContentWithSimpleItem(orgId, simpleItemId, count);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Создание записи с составным предметом
     * @param {number} orgId
     * @param {number} compoundItemId
     * @param {number} count
     */
    static createContentWithCompoundItem(orgId, compoundItemId, count) {
        try {
            return this.getService().createContentWithCompoundItem(orgId, compoundItemId, count);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаление строки содержимого хранилища по id
     * @param {number} id
     */
    static deleteContentById(id) {
        try {
            return this.getService().deleteContentById(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получение строки содержимого хранилища по id
     * @param {number} id
     */
    static findContentById(id) {
        try {
            return this.getService().findContentById(id);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получение всех ресурсов организации по ID
     * @param {number} orgId
     */
    static findAllResourcesByOrgId(orgId) {
        try {
            return this.getService().findAllResourcesByOrgId(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получение всех простых предметов организации по ID
     * @param {number} orgId
     */
    static findAllSimpleItemsByOrgId(orgId) {
        try {
            return this.getService().findAllSimpleItemsByOrgId(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получение всех составных предметов организации по ID
     * @param {number} orgId
     */
    static findAllCompoundItemsByOrgId(orgId) {
        try {
            return this.getService().findAllCompoundItemsByOrgId(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получение строки содержимого по организации и ресурсу
     * @param {number} orgId
     * @param {number} resourceId
     */
    static findContentByOrgAndResource(orgId, resourceId) {
        try {
            return this.getService().findContentByOrgAndResource(orgId, resourceId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получение строки содержимого по организации и простому предмету
     * @param {number} orgId
     * @param {number} simpleItemId
     */
    static findContentByOrgAndSimpleItem(orgId, simpleItemId) {
        try {
            return this.getService().findContentByOrgAndSimpleItem(orgId, simpleItemId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получение строки содержимого по организации и составному предмету
     * @param {number} orgId
     * @param {number} compoundItemId
     */
    static findContentByOrgAndCompoundItem(orgId, compoundItemId) {
        try {
            return this.getService().findContentByOrgAndCompoundItem(orgId, compoundItemId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Инкрементировать количество ресурса у организации
     * @param {number} orgId
     * @param {number} resourceId
     * @param {number} incrementValue
     */
    static incrementOrgResource(orgId, resourceId, incrementValue) {
        try {
            return this.getService().incrementOrgResource(orgId, resourceId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Инкрементировать количество простого предмета у организации
     * @param {number} orgId
     * @param {number} simpleItemId
     * @param {number} incrementValue
     */
    static incrementOrgSimpleItem(orgId, simpleItemId, incrementValue) {
        try {
            return this.getService().incrementOrgSimpleItem(orgId, simpleItemId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Инкрементировать количество составного предмета у организации
     * @param {number} orgId
     * @param {number} compoundItemId
     * @param {number} incrementValue
     */
    static incrementOrgCompoundItem(orgId, compoundItemId, incrementValue) {
        try {
            return this.getService().incrementOrgCompoundItem(orgId, compoundItemId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Декрементировать количество ресурса у организации
     * @param {number} orgId
     * @param {number} resourceId
     * @param {number} decrementValue
     */
    static decrementOrgResource(orgId, resourceId, decrementValue) {
        try {
            return this.getService().decrementOrgResource(orgId, resourceId, decrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Декрементировать количество простого предмета у организации
     * @param {number} orgId
     * @param {number} simpleItemId
     * @param {number} decrementValue
     */
    static decrementOrgSimpleItem(orgId, simpleItemId, decrementValue) {
        try {
            return this.getService().decrementOrgSimpleItem(orgId, simpleItemId, decrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Декрементировать количество составного предмета у организации
     * @param {number} orgId
     * @param {number} compoundItemId
     * @param {number} decrementValue
     */
    static decrementOrgCompoundItem(orgId, compoundItemId, decrementValue) {
        try {
            return this.getService().decrementOrgCompoundItem(orgId, compoundItemId, decrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновить цену по организации и ресурсу
     * @param {number} orgId
     * @param {number} resourceId
     * @param {number} newPrice
     */
    static updatePriceByOrgAndResource(orgId, resourceId, newPrice) {
        try {
            return this.getService().updatePriceByOrgAndResource(orgId, resourceId, newPrice);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновить цену по организации и простому предмету
     * @param {number} orgId
     * @param {number} simpleItemId
     * @param {number} newPrice
     */
    static updatePriceByOrgAndSimpleItem(orgId, simpleItemId, newPrice) {
        try {
            return this.getService().updatePriceByOrgAndSimpleItem(orgId, simpleItemId, newPrice);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Обновить цену по организации и составному предмету
     * @param {number} orgId
     * @param {number} compoundItemId
     * @param {number} newPrice
     */
    static updatePriceByOrgAndCompoundItem(orgId, compoundItemId, newPrice) {
        try {
            return this.getService().updatePriceByOrgAndCompoundItem(orgId, compoundItemId, newPrice);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Создать нового члена хранилища
     * @param {number} storageId
     * @param {number} memberOrgId
     */
    static createNewStorageMember(storageId, memberOrgId) {
        try {
            return this.getService().createNewStorageMember(storageId, memberOrgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Создать или увеличить ресурс организации
     * @param {number} orgId
     * @param {number} resourceId
     * @param {number} incrementValue
     */
    static createOrIncrementOrgResource(orgId, resourceId, incrementValue = 1) {
        try {
            return this.getService().createOrIncrementOrgResource(orgId, resourceId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Создать или увеличить простой предмет организации
     * @param {number} orgId
     * @param {number} simpleItemId
     * @param {number} incrementValue
     */
    static createOrIncrementOrgSimpleItem(orgId, simpleItemId, incrementValue = 1) {
        try {
            return this.getService().createOrIncrementOrgSimpleItem(orgId, simpleItemId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Создать или увеличить составной предмет организации
     * @param {number} orgId
     * @param {number} compoundItemId
     * @param {number} incrementValue
     */
    static createOrIncrementOrgCompoundItem(orgId, compoundItemId, incrementValue = 1) {
        try {
            return this.getService().createOrIncrementOrgCompoundItem(orgId, compoundItemId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Создание нового хранилища
     * @param {number} ownerOrgId
     */
    static createNewStorage(ownerOrgId) {
        try {
            return this.getService().createNewStorage(ownerOrgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}