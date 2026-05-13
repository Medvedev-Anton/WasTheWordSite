import { TaxesFacade } from "../facades/taxes_facade.js";
import { MainController } from "./main_controller.js";

export class TaxController extends MainController {
    constructor (request, response) {
        super(request, response);
    }

    /**
     * Обработчик получения налогов пользователей
     */
    getUsersTaxPercent() {
        try {
            const tax = TaxesFacade.getUsersTaxPercent();

            this.send(200, {
                tax: tax
            });
        }
        catch (e) {
            console.error('Get users tax error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик получения налогов организаций
     */
    getOrgsTaxPercent() {
        try {
            const tax = TaxesFacade.getOrgsTaxPercent();

            this.send(200, {
                tax: tax
            });
        }
        catch (e) {
            console.error('Get orgs tax error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик обновления налогов пользователей
     */
    updateUsersTaxPercent() {
        const validate = this.has([
            'newTax'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const newTax = parseInt(this.request.body.newTax);
            TaxesFacade.updateUsersTaxPercent(newTax);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update users tax error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик обновления налогов организаций
     */
    updateOrgsTaxPercent() {
        const validate = this.has([
            'newTax'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const newTax = parseInt(this.request.body.newTax);
            TaxesFacade.updateOrgsTaxPercent(newTax);

            this.send(200, {
                message: 'Update success'
            });
        }
        catch (e) {
            console.error('Update orgs tax error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}