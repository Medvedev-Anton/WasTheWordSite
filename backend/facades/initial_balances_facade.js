export class InitialBalancesFacade {
    /**
     * Получает начальный баланс пользователей
     * @returns {int}
     */
    static getUserInitialBalance() {
        return this.mapper.getBalanceByName('user');
    }

    /**
     * Получает начальный баланс организаций
     * @returns {int}
     */
    static getOrgInitialBalance() {
        return this.mapper.getBalanceByName('org');
    }

    /**
     * Обновляет начальный баланс пользователей
     * @param {int} newBalance
     * @returns {void}
     */
    static updateUserInitialBalance(newBalance) {
        try {
            return this.mapper.updateBalanceByName('user', newBalance);
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
        try {
            return this.mapper.updateBalanceByName('org', newBalance);
        }
        catch (e) {
            throw new Error(`Ошибка при обновлении начального баланса организации: ${e.message}`);
        }
    }
}