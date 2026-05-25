import { BankFacade } from "../facades/bank_facade.js";
import { LoansFacade } from "../facades/loans_facade.js";
import { MainController } from "./main_controller.js";

export class BankController extends MainController {
    constructor(request, response) {
        super(request, response);
    }

    /**
     * Обработчик запроса получения набора кредитных параметров банка
     */
    getLoanParams() {
        const validate = this.has([
            'bankId'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const bankId = parseInt(this.request.params.bankId);
            const params = BankFacade.entity('users').getBankAllParams(bankId);

            return this.send(200, {
                params: params
            });
        }
        catch (e) {
            console.error('Get bank loan params error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик обновления процента по кредиту для пользователей
     */
    updateUsersLoanPercent() {
        const validate = this.has([
            'bankId',
            'newPercent'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const bankId = parseInt(this.request.params.bankId);
            const newPercent = parseInt(this.request.body.newPercent);

            BankFacade.entity('users').updateLoanPercent(bankId, newPercent);

            return this.send(200, {
                message: 'Success update'
            });
        }
        catch (e) {
            console.error('Update bank loan users percent error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик обновления срока кредита для пользователей
     */
    updateUsersLoanDuring() {
        const validate = this.has([
            'bankId',
            'newDuringDays'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const bankId = parseInt(this.request.params.bankId);
            const newDuringDays = parseInt(this.request.body.newDuringDays);

            BankFacade.entity('users').updateLoanDuring(bankId, newDuringDays);

            return this.send(200, {
                message: 'Success update'
            });
        }
        catch (e) {
            console.error('Update bank loan users during error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик обновления процента по кредиту для организаций
     */
    updateOrgsLoanPercent() {
        const validate = this.has([
            'bankId',
            'newPercent'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const bankId = parseInt(this.request.params.bankId);
            const newPercent = parseInt(this.request.body.newPercent);

            BankFacade.entity('orgs').updateLoanPercent(bankId, newPercent);

            return this.send(200, {
                message: 'Success update'
            });
        }
        catch (e) {
            console.error('Update bank loan orgs percent error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик обновления срока кредита для организаций
     */
    updateOrgsLoanDuring() {
        const validate = this.has([
            'bankId',
            'newDuringDays'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const bankId = parseInt(this.request.params.bankId);
            const newDuringDays = parseInt(this.request.body.newDuringDays);

            BankFacade.entity('orgs').updateLoanDuring(bankId, newDuringDays);

            return this.send(200, {
                message: 'Success update'
            });
        }
        catch (e) {
            console.error('Update bank loan orgs during error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик получения всех заемщиков-пользователей банка
     */
    getUsersBorrowers() {
        const validate = this.has([
            'bankId',
        ]);

        if (validate === false) {
            return;
        }

        try {
            const bankId = parseInt(this.request.params.bankId);
            const borrowers = LoansFacade.entity('users').getAllBorrowersByCreditor(bankId);
        
            return this.send(200, {
                borrowers: borrowers
            });
        }
        catch (e) {
            console.error('Get users borrowers error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик получения всех заемщиков-организаций банка
     */
    getOrgsBorrowers() {
        const validate = this.has([
            'bankId',
        ]);

        if (validate === false) {
            return;
        }

        try {
            const bankId = parseInt(this.request.params.bankId);
            const borrowers = LoansFacade.entity('orgs').getAllBorrowersByCreditor(bankId);

            return this.send(200, {
                borrowers: borrowers
            });
        }
        catch (e) {
            console.error('Get orgs borrowers error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}