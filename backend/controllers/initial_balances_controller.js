import { InitialBalancesFacade } from "../facades/initial_balances_facade.js";
import { MainController } from "./main_controller.js";

export class InitialBalancesController extends MainController {
    constructor(request, response) {
        super(request, response);
    }

    /**
     * Обработчик запроса получения баланса пользователя
     */
    getUserBalance() {
        try {
            const userBalance = InitialBalancesFacade.getUserInitialBalance();

            this.send(200, {
                message: 'Get success',
                balance: userBalance
            });
        }
        catch (e) {
            console.error('Get initial user balance error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик запроса получения баланса организации
     */
    getOrgBalance() {
        try {
            const prgBalance = InitialBalancesFacade.getOrgInitialBalance();

            this.send(200, {
                message: 'Get success',
                balance: prgBalance
            });
        }
        catch (e) {
            console.error('Get initial org balance error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик запроса обновления баланс пользователя
     */
    updateUserBalance() {
        const validate = this.has([
            'newBalance'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const newBalance = parseInt(this.request.body.newBalance);

            InitialBalancesFacade.updateUserInitialBalance(newBalance);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update initial user balance error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик запроса обновления баланс организации
     */
    updateOrgBalance() {
        const validate = this.has([
            'newBalance'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const newBalance = parseInt(this.request.body.newBalance);
            
            InitialBalancesFacade.updateOrgInitialBalance(newBalance);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update initial org balance error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}