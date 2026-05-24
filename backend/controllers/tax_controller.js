import { OrgTaxPercentFacade } from "../facades/org_tax_percent_facade.js";
import { UserTaxPercentFacade } from "../facades/user_tax_percent_facade.js";
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
            const tax = UserTaxPercentFacade.getTaxPercent();

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
        const validate = this.has([
            'orgType'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const orgType = this.request.params.orgType;
            const tax = OrgTaxPercentFacade.getTaxPercent(orgType);

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
     * Обработчик получения налогов всех организаций сразу
     */
    getAllOrgsTaxesPercents() {
        try {
            const taxes = OrgTaxPercentFacade.getAllTaxes();

            this.send(200, {
                taxes: taxes
            });
        }
        catch (e) {
            console.error('Get all orgs taxes error:', e.message);
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
            const newTax = parseFloat(this.request.body.newTax);
            UserTaxPercentFacade.updateTaxPercent(newTax);

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
            'orgType',
            'newTax'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const newTax = parseFloat(this.request.body.newTax);
            const orgType = this.request.body.orgType;

            OrgTaxPercentFacade.updateTaxPercent(orgType, newTax);

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