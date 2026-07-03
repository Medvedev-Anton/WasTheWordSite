import ResourcesMapperInterface from "../../mappers/resources/resources_mapper_interface.js";

export default class ResourcesServiceInterface {
    /**
     * @param {ResourcesMapperInterface} mapper 
     */
    constructor(mapper) { 
        if (new.target === 'ResourcesServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса ResourcesServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Возвращает все ресурсы
     */
    getAll() {
        throw new Error('getAll должен быть переопределен в наследнике');
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
     * Обновление требуемого количества энергии
     * @param {number} id
     * @param {number} newEnergy
     */
    updateNeedEnergy(id, newEnergy) {
        throw new Error('updateNeedEnergy должен быть переопределен в наследнике');
    }

    /**
     * Обновление требуемого количества денег
     * @param {number} id
     * @param {number} newMoney
     */
    updateNeedMoney(id, newMoney) {
        throw new Error('updateNeedMoney должен быть переопределен в наследнике');
    }

    /**
     * Возвращает данные ресурса по id
     * @param {number} id
     */
    getById(id) {
        throw new Error('getById должен быть переопределен в наследнике');
    }

    /**
     * Удаляет файл с изображением с сервера
     * @param {number} id
     */
    deleteImage(id) {
        throw new Error('deleteImage должен быть переопределен в наследнике');
    }
}