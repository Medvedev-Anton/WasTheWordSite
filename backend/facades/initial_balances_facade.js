import { InitialBalancesMapper } from "../mappers/initial_balances/initial_balances_mapper.js";
import { InitialBalancesService } from "../services/initial_balances/initial_balances_service.js";

export class InitialBalancesFacade {
    /**
     * Получает начальный баланс пользователей
     * @returns {int}
     */
    static getUserInitialBalance() {
        const service = new InitialBalancesService(
            new InitialBalancesMapper()
        );

        return service.getUserInitialBalance();
    }

    /**
     * Получает начальный баланс организаций
     * @returns {int}
     */
    static getOrgInitialBalance() {
        const service = new InitialBalancesService(
            new InitialBalancesMapper()
        );

        return service.getOrgInitialBalance();
    }

    /**
     * Обновляет начальный баланс пользователей
     * @param {int} newBalance
     * @returns {void}
     */
    static updateUserInitialBalance(newBalance) {
        const service = new InitialBalancesService(
            new InitialBalancesMapper()
        );

        try {
            return service.updateUserInitialBalance(newBalance);
        }
        catch (e) {
            throw new Error(`Ошибка при обновлении начального баланса пользователя: ${e.message}`);
        }
    }

    /**
     * Обновляет начальный баланс организаций
     * @param {int} newBalance
     * @returns {void}
     */
    static updateOrgInitialBalance(newBalance) {
        const service = new InitialBalancesService(
            new InitialBalancesMapper()
        );

        try {
            return service.updateOrgInitialBalance(newBalance);
        }
        catch (e) {
            throw new Error(`Ошибка при обновлении начального баланса организации: ${e.message}`);
        }
    }
}