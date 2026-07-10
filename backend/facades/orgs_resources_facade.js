import OrgsResourcesMapper from "../mappers/orgs_resources/orgs_resources_mapper.js";
import OrgsResourcesService from "../services/orgs_resources/orgs_resources_service.js";

export default class OrgsResourcesFacade {
    static getService() {
        return new OrgsResourcesService(
            new OrgsResourcesMapper()
        );
    }

    /**
     * Создание записи
     * @param {number} orgId
     * @param {number} resourceId
     * @param {number} count
     */
    static create(orgId, resourceId, count) {
        try {
            return this.getService().create(orgId, resourceId, count);
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
     * Создать или увеличить на единицу
     * @param {number} orgId
     * @param {number} resourceId
     */
    static createOrIncrement(orgId, resourceId) {
        try {
            return this.getService().createOrIncrement(orgId, resourceId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Уменьшить количество ресурса организации
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
     * Получить по организации и ресурсу
     * @param {number} orgId
     * @param {number} resourceId
     */
    static getByOrgAndResource(orgId, resourceId) {
        try {
            return this.getService().findByOrgAndResource(orgId, resourceId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}