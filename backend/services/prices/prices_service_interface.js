import { PricesMapperInterace } from "../../mappers/prices/prices_mapper_interface.js";

export class PricesServiceInterface {
    /**
     * @param {PricesMapperInterace} mapper 
     */
    constructor(mapper) {
        if (new.target === 'PricesServiceInterface') {
            throw new Error('Нельзя создать экземпляр класса PricesServiceInterface');
        }

        this.mapper = mapper;
    }

    /**
     * Получает цену за просмотр поста
     */
    getPostViewPrice() {
        throw new Error('getPostViewPrice должен быть переопределен в наследнике');
    }

    /**
     * Обновляет цену за создание поста
     */
    updatePostViewPrice(newPrice) {
        throw new Error('updatePostViewPrice должен быть переопределен в наследнике');
    }
}