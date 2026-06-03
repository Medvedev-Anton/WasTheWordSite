import { BalanceFacade } from "../facades/balance_facade.js";
import { OrgsFacade } from "../facades/orgs_facade.js";
import { MainController } from "./main_controller.js";

export class BalanceController extends MainController {
    constructor(req, res) {
        super(req, res);
    }

    /**
     * Обрабатывает получение баланса организации
     */
    getOrgBalance() {
        const validate = this.has([
            'id',
        ]);

        if (validate === false) {
            return;
        }
        
        try {
            const orgId = parseInt(this.request.params.id);
            const balance = BalanceFacade.entity('orgs').getBalance(orgId);

            this.send(200, {
                balance: balance
            });
        }
        catch (e) {
            console.error('Get org balance error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обрабатывает получение баланса пользователя
     */
    getUserBalance() {
        try {
            const userId = parseInt(this.request.user.userId);
            const balance = BalanceFacade.entity('users').getBalance(userId);

            this.send(200, {
                balance: balance
            });
        }
        catch (e) {
            console.error('Transfer from admin to org balance error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обрабатывает перевод с баланса админа на баланс организации
     */
    transferFromAdminToOrg() {
        const validate = this.has([
            'id',
            'sum'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const orgId = parseInt(this.request.params.id);
            const userId = parseInt(this.request.user.userId);
            const sum = parseFloat(this.request.body.sum);

            OrgsFacade.transferFromAuthorToOrgBalance(orgId, userId, sum);

            this.send(200, {
                message: 'success'
            });
        }
        catch (e) {
            console.error('Transfer from admin to org balance error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обрабатывает перевод с баланса организации на баланс админа
     */
    transferFromOrgToAdmin() {
        const validate = this.has([
            'id',
            'sum'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const orgId = parseInt(this.request.params.id);
            const userId = parseInt(this.request.user.userId);
            const sum = parseFloat(this.request.body.sum);

            OrgsFacade.transferFromOrgToAuthorBalance(orgId, userId, sum);

            this.send(200, {
                message: 'success'
            });
        }
        catch (e) {
            console.error('Transfer from admin to org balance error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}