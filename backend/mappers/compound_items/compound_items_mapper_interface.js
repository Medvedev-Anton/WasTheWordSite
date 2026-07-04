export default class CompoundItemsMapperInterface {
     constructor() {
        if (new.target === 'CompoundItemsMapperInterface') {
            throw new Error('Нельзя создать экземпляр класса CompoundItemsMapperInterface');
        }
    }

    /**
     * Возвращает все предметы
     */
    findAll() {
        throw new Error('findAll должен быть переопределен в наследнике');
    }

    /**
     * Создание предмета
     * @param {number} id
     * @param {string} name
     * @param {string} imageUrl
     * @param {number} number
     * @param {Array<Record<string, number>>} itemsParts
     */
    create(number, name, imageUrl, number, itemsParts) {
        throw new Error('create должен быть переопределен в наследнике');
    }

    /**
     * Удаление предмета
     * @param {number} id
     */
    delete(id) {
        throw new Error('delete должен быть переопределен в наследнике');
    }

    /**
     * Обновление поля предмета
     * @param {number} id
     * @param {string} fieldName
     * @param {any} newValue
     */
    update(id, fieldName, newValue) {
        throw new Error('update должен быть переопределен в наследнике');
    }

    /**
     * Создание части предмета
     * @param {number} compoundItemId
     * @param {number} partItemId
     */
    createPart(compoundItemId, partItemId) {
        throw new Error('createPart должен быть переопределен в наследнике');
    }

    /**
     * Удаление части предмета
     * @param {number} partId
     */
    deletePart(partId) {
        throw new Error('deletePart должен быть переопределен в наследнике');
    }

    /**
     * Возвращает данные предмета 
     * @param {number} id
     */
    findById(id) {
        throw new Error('findById должен быть переопределен в наследнике');
    }
}