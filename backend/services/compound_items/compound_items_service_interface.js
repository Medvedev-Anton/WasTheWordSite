import CompoundItemsMapperInterface from "../../mappers/compound_items/compound_items_mapper_interface.js";

export default class CompoundItemsServiceInterface {
    /**
     * @param {CompoundItemsMapperInterface} mapper 
     */
    constructor(mapper) { 
        if (new.target === 'CompoundItemsServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса CompoundItemsServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Возвращает все предметы
     */
    getAll() {
        throw new Error('getAll должен быть переопределен в наследнике');
    }

    /**
     * Создание предмета
     * @param {number} number
     * @param {string} name
     * @param {string} imageUrl
     * @param {Array<Record<string, number>>} itemsParts
     */
    create(number, name, imageUrl, itemsParts) {
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
     * Обновление номера предмета
     * @param {number} id
     * @param {number} newNumber
     */
    updateNumber(id, newNumber) {
        throw new Error('updateNumber должен быть переопределен в наследнике');
    }

    /**
     * Обновление названия
     * @param {number} id
     * @param {string} newName
     */
    updateName(id, newName) {
        throw new Error('updateName должен быть переопределен в наследнике');
    }

    /**
     * Обновление изображения
     * @param {number} id
     * @param {string} newImageUrl
     */
    updateImageUrl(id, newImageUrl) {
        throw new Error('updateName должен быть переопределен в наследнике');
    }

    /**
     * Создание части предмета
     * @param {number} compoundItemId
     * @param {number} partItemId
     * @param {number} countNeed
     */
    createPart(compoundItemId, partItemId, countNeed) {
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