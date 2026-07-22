import OrgsStoragesMapperInterface from "../../mappers/orgs_storages/orgs_storages_mapper_interface.js";

export default class OrgsStoragesServiceInterface {
    /**
     * @param {OrgsStoragesMapperInterface} mapper 
     */
    constructor(mapper) {
        if (new.target === 'OrgsStoragesServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса OrgsStoragesServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Создание записи с ресурсом
     * @param {number} orgId
     * @param {number} resourceId
     * @param {number} count
     */
    createContentWithResource(orgId, resourceId, count) {
        throw new Error('createContentWithResource должен быть переопределен в наследнике');
    }

    /**
     * Создание записи с простым предметом
     * @param {number} orgId
     * @param {number} simpleItemId
     * @param {number} count
     */
    createContentWithSimpleItem(orgId, simpleItemId, count) {
        throw new Error('createContentWithSimpleItem должен быть переопределен в наследнике');
    }

    /**
     * Создание записи с составным предметом
     * @param {number} orgId
     * @param {number} compoundItemId
     * @param {number} count
     */
    createContentWithCompoundItem(orgId, compoundItemId, count) {
        throw new Error('createContentWithCompoundItem должен быть переопределен в наследнике');
    }

    /**
     * Удаление строки содержимого хранилища по id
     * @param {number} id
     */
    deleteContentById(id) {
        throw new Error('deleteContentById должен быть переопределен в наследнике');
    }

    /**
     * Получение строки содержимого хранилища по id
     * @param {number} id
     */
    findContentById(id) {
        throw new Error('findContentById должен быть переопределен в наследнике');
    }

    /**
     * Получение всех ресурсов организации по ID
     * @param {number} orgId
     */
    findAllResourcesByOrgId(orgId) {
        throw new Error('findAllResourcesByOrgId должен быть переопределен в наследнике');
    }

    /**
     * Получение всех простых предметов организации по ID
     * @param {number} orgId
     */
    findAllSimpleItemsByOrgId(orgId) {
        throw new Error('findAllSimpleItemsByOrgId должен быть переопределен в наследнике');
    }

    /**
     * Получение всех составных предметов организации по ID
     * @param {number} orgId
     */
    findAllCompoundItemsByOrgId(orgId) {
        throw new Error('findAllCompoundItemsByOrgId должен быть переопределен в наследнике');
    }

    /**
     * Получение строки содержимого по организации и ресурсу
     * @param {number} orgId
     * @param {number} resourceId
     */
    findContentByOrgAndResource(orgId, resourceId) {
        throw new Error('findContentByOrgAndResource должен быть переопределен в наследнике');
    }

    /**
     * Получение строки содержимого по организации и простому предмету
     * @param {number} orgId
     * @param {number} simpleItemId
     */
    findContentByOrgAndSimpleItem(orgId, simpleItemId) {
        throw new Error('findContentByOrgAndSimpleItem должен быть переопределен в наследнике');
    }

    /**
     * Получение строки содержимого по организации и составному предмету
     * @param {number} orgId
     * @param {number} compoundItemId
     */
    findContentByOrgAndCompoundItem(orgId, compoundItemId) {
        throw new Error('findContentByOrgAndCompoundItem должен быть переопределен в наследнике');
    }

    /**
     * Инкрементировать количество ресурса у организации
     * @param {number} orgId
     * @param {number} resourceId
     * @param {number} incrementValue
     */
    incrementOrgResource(orgId, resourceId, incrementValue) {
        throw new Error('incrementOrgResource должен быть переопределен в наследнике');
    }

    /**
     * Инкрементировать количество простого предмета у организации
     * @param {number} orgId
     * @param {number} simpleItemId
     * @param {number} incrementValue
     */
    incrementOrgSimpleItem(orgId, simpleItemId, incrementValue) {
        throw new Error('incrementOrgSimpleItem должен быть переопределен в наследнике');
    }

    /**
     * Инкрементировать количество составного предмета у организации
     * @param {number} orgId
     * @param {number} compoundItemId
     * @param {number} incrementValue
     */
    incrementOrgCompoundItem(orgId, compoundItemId, incrementValue) {
        throw new Error('incrementOrgCompoundItem должен быть переопределен в наследнике');
    }

    /**
     * Декрементировать количество ресурса у организации
     * @param {number} orgId
     * @param {number} resourceId
     * @param {number} decrementValue
     */
    decrementOrgResource(orgId, resourceId, decrementValue) {
        throw new Error('decrementOrgResource должен быть переопределен в наследнике');
    }

    /**
     * Декрементировать количество простого предмета у организации
     * @param {number} orgId
     * @param {number} simpleItemId
     * @param {number} decrementValue
     */
    decrementOrgSimpleItem(orgId, simpleItemId, decrementValue) {
        throw new Error('incrementOrgSimpleItem должен быть переопределен в наследнике');
    }

    /**
     * Декрементировать количество составного предмета у организации
     * @param {number} orgId
     * @param {number} compoundItemId
     * @param {number} decrementValue
     */
    decrementOrgCompoundItem(orgId, compoundItemId, decrementValue) {
        throw new Error('decrementOrgCompoundItem должен быть переопределен в наследнике');
    }

    /**
     * Обновить цену по организации и ресурсу
     * @param {number} orgId
     * @param {number} resourceId
     * @param {number} newPrice
     */
    updatePriceByOrgAndResource(orgId, resourceId, newPrice) {
        throw new Error('updatePriceByOrgAndResource должен быть переопределен в наследнике');
    }

    /**
     * Обновить цену по организации и простому предмету
     * @param {number} orgId
     * @param {number} simpleItemId
     * @param {number} newPrice
     */
    updatePriceByOrgAndSimpleItem(orgId, simpleItemId, newPrice) {
        throw new Error('updatePriceByOrgAndSimpleItem должен быть переопределен в наследнике');
    }
    
    /**
     * Обновить цену по организации и составному предмету
     * @param {number} orgId
     * @param {number} compoundItemId
     * @param {number} newPrice
     */
    updatePriceByOrgAndCompoundItem(orgId, compoundItemId, newPrice) {
        throw new Error('updatePriceByOrgAndCompoundItem должен быть переопределен в наследнике');
    }

    /**
     * Создать нового члена хранилища
     * @param {number} storageId
     * @param {number} memberOrgId
     */
    createNewStorageMember(storageId, memberOrgId) {
        throw new Error('createNewStorageMember должен быть переопределен в наследнике');
    }

    /**
     * Создать или увеличить ресурс организации
     * @param {number} orgId
     * @param {number} resourceId
     * @param {number} incrementValue
     */
    createOrIncrementOrgResource(orgId, resourceId, incrementValue = 1) {
        throw new Error('createOrIncrementOrgResource должен быть переопределен в наследнике');
    }

    /**
     * Создать или увеличить простой предмет организации
     * @param {number} orgId
     * @param {number} simpleItemId
     * @param {number} incrementValue
     */
    createOrIncrementOrgSimpleItem(orgId, simpleItemId, incrementValue = 1) {
        throw new Error('createOrIncrementOrgSimpleItem должен быть переопределен в наследнике');
    }

    /**
     * Создать или увеличить составной предмет организации
     * @param {number} orgId
     * @param {number} compoundItemId
     * @param {number} incrementValue
     */
    createOrIncrementOrgCompoundItem(orgId, compoundItemId, incrementValue = 1) {
        throw new Error('createOrIncrementOrgCompoundItem должен быть переопределен в наследнике');
    }

    /**
     * Создание нового хранилища
     * @param {number} ownerOrgId
     */
    createNewStorage(ownerOrgId) {
        throw new Error('createNewStorage должен быть переопределен в наследнике');
    }

    /**
     * Получить хранилище по ID владельца
     * @param {number} ownerOrgId
     */
    findStorageByOwner(ownerOrgId) {
        throw new Error('findStorageByOwner должен быть переопределен в наследнике');
    }
}