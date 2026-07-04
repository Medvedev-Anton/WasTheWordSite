export default class SimpleItemsMapperInterface {
    constructor() {
        if (new.target === 'SimpleItemsMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса SimpleItemsMapperInterface');
        }
    }

    /**
     * Возвращает все ресурсы
     */
    findAll() {
        throw new Error('findAll должен быть переопределен в наследнике');
    }

    /**
     * Создание ресурса
     * @param {number} id
     * @param {string} name
     * @param {string} imageUrl
     * @param {number} countNeedEnergy
     * @param {number} countNeedMoney
     * @param {number} resourceId
     * @param {number} countNeedResource
     */
    create(number, name, imageUrl, countNeedEnergy, countNeedMoney, resourceId, countNeedResource) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Удаление ресурса
     * @param {number} id
     */
    delete(id) {
        throw new Error('delete должен быть переопределен в наследнике');
    }

    /**
     * Обновление поля ресурса
     * @param {number} id
     * @param {string} fieldName
     * @param {any} newValue
     */
    update(id, fieldName, newValue) {
        throw new Error('update должен быть переопределен в наследнике');
    }

    /**
     * Возвращает данные ресурса 
     * @param {number} id
     */
    findById(id) {
        throw new Error('findById должен быть переопределен в наследнике');
    }
}