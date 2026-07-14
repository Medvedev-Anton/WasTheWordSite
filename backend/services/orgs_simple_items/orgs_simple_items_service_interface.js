import OrgsSimpleItemsMapperInterface from "../../mappers/orgs_simple_items/orgs_simple_items_mapper_interface.js";

export default class OrgsSimpleItemsServiceInterface {
    /**
     * @param {OrgsSimpleItemsMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'OrgsSimpleItemsServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса OrgsSimpleItemsServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Создание записи
     * @param {number} orgId
     * @param {number} simpleItemId
     * @param {number} count
     */
    create(orgId, simpleItemId, count) {
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
     * Получить по организации и предмету
     * @param {number} orgId
     * @param {number} simpleItemId
     */
    getByOrgAndSimpleItem(orgId, simpleItemId) {
        throw new Error('getByOrgAndSimpleItem должен быть переопределен в наследнике');
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
     * Уменьшить количество
     * @param {number} id
     * @param {number} decrementValue
     */
    decrement(id, decrementValue) {
        throw new Error('decrement должен быть переопределен в наследнике');
    }

    /**
     * Создать или увеличить на единицу
     * @param {number} orgId
     * @param {number} simpleItemId
     */
    createOrIncrement(orgId, simpleItemId) {
        throw new Error('createOrIncrement должен быть переопределен в наследнике');
    }

    /**
     * Получение количества определенного предмета
     * @param {number} orgId
     * @param {number} simpleItemId
     */
    getOrgSimpleItemCount(orgId, simpleItemId) {
        throw new Error('getOrgSimpleItemCount должен быть переопределен в наследнике');
    }

    /**
     * Обновление цены предмета организации
     * @param {number} orgId
     * @param {number} simpleItemId
     * @param {number} newPrice
     */
    updateOrgSimpleItemPrice(orgId, simpleItemId, newPrice) {
        throw new Error('updateOrgSimpleItemPrice должен быть переопределен в наследнике');
    }
}