import EnergyOrgsMapper from "../mappers/energy/energy_orgs_mapper.js";
import EnergyUsersMapper from "../mappers/energy/energy_users_mapper.js";
import EnergyService from "../services/energy/energy_service.js";
import { db } from "../database/init.js";
import { BalanceFacade } from "./balance_facade.js";
import EnergyParamsFacade from "./energy_params_facade.js";

export default class EnergyFacade {
    constructor(entity) {
        if (entity === 'users') {
            this.service = new EnergyService(
                new EnergyUsersMapper()
            );
        }
        else if (entity === 'orgs') {
            this.service = new EnergyService(
                new EnergyOrgsMapper()
            );
        }
        else {
            throw new Error('Неизвестная сущность для работы с энергией: ' + entity);
        }
    }

    static entity(entity) {
        return new this(entity);
    }

    /**
     * Получает значение энергии сущности
     * @param {number} userId
     */
    get(entityId) {
        try {
            return this.service.get(entityId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Инкрементирует значение энергии сущности
     * @param {number} entityId
     * @param {number} incrementValue
     */
    increment(entityId, incrementValue) {
        try {
            return this.service.increment(entityId, incrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Декрементирует значение энергии сущности
     * @param {number} entityId
     * @param {number} decrementValue
     */
    decrement(entityId, decrementValue) {
        try {
            return this.service.decrement(entityId, decrementValue);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Покупка энергии
     * @param {number} buyerId
     * @param {number} countEnergy
     */
    buyEnergy(buyerId, countEnergy) {
        const transaction = db.transaction(() => {
            try {
                const balanceManger = BalanceFacade.entity(this.entity);

                const entityBalance = balanceManger.getBalance(buyerId);
                const energyPrice = EnergyParamsFacade.getBuyEnergyPrice();
                const finalPrice = energyPrice * countEnergy;

                if (entityBalance < finalPrice) {
                    throw new Error(`У сущности ${this.entity} с ID = ${buyerId} не хватает средств для покупки энергии`);
                }
                
                balanceManger.decrement(buyerId, finalPrice);
                this.increment(buyerId, countEnergy);
            }
            catch (e) {
                throw new Error(e.message);
            }
        });

        try {
            transaction();
        }
        catch (e) {
            throw new Error('Ошибка при покупке энергии: ' + e.message); 
        }
    }
}