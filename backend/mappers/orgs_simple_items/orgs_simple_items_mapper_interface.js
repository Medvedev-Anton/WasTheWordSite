export default class OrgsSimpleItemsMapperInterface {
    constructor() {
        if (new.target === 'OrgsSimpleItemsMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса OrgsSimpleItemsMapperInterface');
        }
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
    findById(id) {
        throw new Error('findById должен быть переопределен в наследнике');
    }

    /**
     * Получить все ресурсы организации
     * @param {number} orgId
     */
    findAllByOrgId(orgId) {
        throw new Error('findAllByOrgId должен быть переопределен в наследнике');
    }

    /**
     * Получить по организации и предмету
     * @param {number} orgId
     * @param {number} simpleItemId
     */
    findByOrgAndSimpleItem(orgId, simpleItemId) {
        throw new Error('findAllByOrgId должен быть переопределен в наследнике');
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
     * Получение количества определенного предмета
     * @param {number} orgId
     * @param {number} simpleItemId
     */
    findCountByOrgAndSimpleItem(orgId, simpleItemId) {
        throw new Error('findCountByOrgAndSimpleItem должен быть переопределен в наследнике');
    }
}