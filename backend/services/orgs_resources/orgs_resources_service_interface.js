import OrgsResourcesMapperInterface from "../../mappers/orgs_resources/orgs_resources_mapper_interface.js";

export default class OrgsResourcesServiceInterface {
    /**
     * @param {OrgsResourcesMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'OrgsResourcesServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса OrgsResourcesServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Создание записи
     * @param {number} orgId
     * @param {number} resourceId
     * @param {number} count
     */
    create(orgId, resourceId, count) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Удаление записи
     * @param {number} id
     */
    delete(id) {
        throw new Error('delete должен быть переопределен в наследнике');
    }

    /**
     * Получить по ID
     * @param {number} id
     */
    getById(id) {
        throw new Error('getById должен быть переопределен в наследнике');
    }

    /**
     * Получить все ресурсы организации
     * @param {number} orgId
     */
    getAllByOrgId(orgId) {
        throw new Error('getAllByOrgId должен быть переопределен в наследнике');
    }

    /**
     * Получить по организации и ресурсу
     * @param {number} orgId
     * @param {number} resourceId
     */
    getByOrgAndResource(orgId, resourceId) {
        throw new Error('getByOrgAndResource должен быть переопределен в наследнике');
    }

    /**
     * Увеличить количество
     * @param {number} id
     * @param {number} incrementValue
     */
    increment(id, incrementValue) {
        throw new Error('increment должен быть переопределен в наследнике');
    }

    /**
     * Создать или увеличить на единицу
     * @param {number} orgId
     * @param {number} resourceId
     * @param {number} incrementValue
     */
    createOrIncrement(orgId, resourceId, incrementValue = 1) {
        throw new Error('createOrIncrement должен быть переопределен в наследнике');
    }

    /**
     * Уменьшить количество ресурса организации
     * @param {number} orgId
     * @param {number} resourceId
     * @param {number} decrementValue
     */
    decrementOrgResource(orgId, resourceId, decrementValue) {
        throw new Error('increment должен быть переопределен в наследнике');
    }

    /**
     * Обновить цену ресурса
     * @param {number} orgId
     * @param {number} resourceId
     * @param {number} newPrice
     */
    updateOrgResourcePrice(orgId, resourceId, newPrice) {
        throw new Error('updateOrgResourcePrice должен быть переопределен в наследнике');
    }
}