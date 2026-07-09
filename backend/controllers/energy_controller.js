import EnergyFacade from "../facades/energy_facade.js";
import EnergyParamsFacade from "../facades/energy_params_facade.js";
import { OrgsFacade } from "../facades/orgs_facade.js";
import UsersOrgsVisitsFacade from "../facades/users_orgs_visits_facade.js";
import { MainController } from "./main_controller.js";

export default class EnergyController extends MainController {
    constructor(request, response) {
        super(request, response);
    }

    /**
     * Обработка начисления за посещения организации
     */
    incrementForOrgVisit() {
        const validate = this.has([
            'id',
        ]);

        if (validate === false) {
            return;
        }

        try {
            const userId = parseInt(this.request.user.userId);
            const orgId = parseInt(this.request.params.id);

            if (UsersOrgsVisitsFacade.get(userId, orgId) == null) {
                UsersOrgsVisitsFacade.create(userId, orgId);
                EnergyFacade.entity('users').increment(userId, 1);

                const energyToOrg = EnergyParamsFacade.getEnergyToOrgForOrgVisit();
                EnergyFacade.entity('orgs').increment(orgId, energyToOrg);
            }
            
            this.send(200, {
                message: 'Success'
            });
        }
        catch (e) {
            console.error('Increment for org visit error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Покупка энергии организацией
     */
    orgBuyEnergy() {
        const validate = this.has([
            'orgId',
            'countEnergy'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const userId = parseInt(this.request.user.userId);
            const orgId = parseInt(this.request.body.orgId);
            const orgAdmin = OrgsFacade.getAdminId(orgId);

            if (userId !== orgAdmin) {
                this.send(400, {
                    message: 'Вы не являетесь владельцем этой организации'
                });
                return;
            }

            const countEnergy = parseInt(this.request.body.countEnergy);

            const energyManager = EnergyFacade.entity('orgs');

            energyManager.buyEnergy(orgId, countEnergy);

            const orgEnergy = energyManager.get(orgId);

            this.send(200, {
                'orgEnergy': orgEnergy
            });
        }
        catch (e) {
            console.error('Org buy energy error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Перевод энергии из организации в подорганизацию
     */
    transferFromOrgToSuborg() {
        const validate = this.has([
            'orgIdFrom',
            'suborgIdTo',
            'countEnergy'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const orgIdFrom = parseInt(this.request.body.orgIdFrom);
            const suborgIdTo = parseInt(this.request.body.suborgIdTo);
            const countEnergy = parseInt(this.request.body.countEnergy);
            const userId = parseInt(this.request.user.userId);

            const orgIdFromAdmin = OrgsFacade.getAdminId(orgIdFrom);

            if (userId !== orgIdFromAdmin) {
                this.send(400, {
                    message: 'Вы не являетесь владельцем организации чтобы осуществить перевод'
                });
                return;
            }

            EnergyFacade.transferFromOrgToOrg(orgIdFrom, suborgIdTo, countEnergy);
        }
        catch (e) {
            console.error('Transfer energy from org to suborg error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Перевод энергии из подорганизации в организацию
     */
    transferFromOrgToSuborg() {
        const validate = this.has([
            'suborgIdFrom',
            'orgIdTo',
            'countEnergy'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const suborgIdFrom = parseInt(this.request.body.suborgIdFrom);
            const orgIdTo = parseInt(this.request.body.orgIdTo);
            const countEnergy = parseInt(this.request.body.countEnergy);
            const userId = parseInt(this.request.user.userId);

            const orgIdToAdmin = OrgsFacade.getAdminId(orgIdTo);

            if (userId !== orgIdToAdmin) {
                this.send(400, {
                    message: 'Вы не являетесь владельцем организации чтобы осуществить перевод'
                });
                return;
            }

            EnergyFacade.transferFromOrgToOrg(suborgIdFrom, orgIdTo, countEnergy);
        }
        catch (e) {
            console.error('Transfer energy from org to suborg error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}