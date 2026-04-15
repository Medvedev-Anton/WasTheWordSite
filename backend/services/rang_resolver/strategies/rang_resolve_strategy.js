export class RangResolveStrategy {
    /**
     * Определяет логику вычисления ранга пользователю в зависимости от действия
     * @param {int} userId 
     * @returns {int}
     */
    resolve(userId) {
        throw new Error('resolve должен быть переопределен в наследнике');
    }
}