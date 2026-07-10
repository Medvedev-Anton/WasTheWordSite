import OrgsSimpleItemsMapper from "../mappers/orgs_simple_items/orgs_simple_items_mapper.js";
import OrgsSimpleItemsService from "../services/orgs_simple_items/orgs_simple_items_service.js";

export default class OrgsSimpleItemsFacade {
    static getService() {
        return new OrgsSimpleItemsService(
            new OrgsSimpleItemsMapper()
        );
    }

    /**
     * Создание записи
     * @param {number} orgId
     * @param {number} simpleItemId
     * @param {number} count
     */
    static create(orgId, simpleItemId, count) {
        try {
            return this.getService().create(orgId, simpleItemId, count);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Удаление записи
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
     * Получить по ID
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
     * Получить все ресурсы организации
     * @param {number} orgId
     */
    static getAllByOrgId(orgId) {
        try {
            return this.getService().getAllByOrgId(orgId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Получить по организации и предмету
     * @param {number} orgId
     * @param {number} simpleItemId
     */
    static getByOrgAndSimpleItem(orgId, simpleItemId) {
        try {
            return this.getService().getByOrgAndSimpleItem(orgId, simpleItemId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Увеличить количество
     * @param {number} id
     * @param {number} incrementValue
     */
    static increment(id, incrementValue) {
        try {
            return this.getService().increment(id, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Создать или увеличить на единицу
     * @param {number} orgId
     * @param {number} simpleItemId
     */
    static createOrIncrement(orgId, simpleItemId) {
        try {
            return this.getService().createOrIncrement(orgId, simpleItemId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}