export default class ResourcesMapperInterface {
    constructor() {
        if (new.target === 'ResourcesMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса ResourcesMapperInterface');
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
     * @param {string} name
     * @param {string} imageUrl
     * @param {number} countNeedEnergy
     * @param {number} countNeedMoney
     */
    create(name, imageUrl, countNeedEnergy, countNeedMoney) {
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
}