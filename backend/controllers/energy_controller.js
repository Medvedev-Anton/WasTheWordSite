import EnergyFacade from "../facades/energy_facade.js";
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
            'orgId',
        ]);

        if (validate === false) {
            return;
        }

        try {
            const userId = parseInt(this.request.user.userId);
            const orgId = parseInt(this.request.params.orgId);

            if (UsersOrgsVisitsFacade.get(userId, orgId) == null) {
                UsersOrgsVisitsFacade.create(userId, orgId);
                EnergyFacade.incrementUser(userId, 1);
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
}