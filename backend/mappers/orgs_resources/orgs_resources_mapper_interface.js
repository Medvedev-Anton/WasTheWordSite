export default class OrgsResourcesMapperInterface {
    constructor() {
        if (new.target === 'OrgsResourcesMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса OrgsResourcesMapperInterface');
        }
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
     * Получить по организации и ресурсу
     * @param {number} orgId
     * @param {number} resourceId
     */
    findByOrgAndResource(orgId, resourceId) {
        throw new Error('findAllByOrgId должен быть переопределен в наследнике');
    }
}