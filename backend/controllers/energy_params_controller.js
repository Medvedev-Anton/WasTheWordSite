import EnergyParamsFacade from "../facades/energy_params_facade.js";
import { MainController } from "./main_controller.js";

export default class EnergyParamsController extends MainController {
    constructor(request, response) {
        super(request, response);
    }

    /**
     * Вовзращает цену за покупку энергии
     */
    getBuyEnergyPrice() {
        try {
            const price = EnergyParamsFacade.getBuyEnergyPrice();

            this.send(200, {
                price: price
            });
        }
        catch (e) {
            console.error('Get buy energy price error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обновляет цену за покупку энергии
     */
    updateBuyEnergyPrice() {
        const validate = this.has([
            'newValue'
        ]);

        if (validate === false) {
            return;
        }
        
        try {
            const newValue = parseInt(this.request.body.newValue);

            EnergyParamsFacade.updateBuyEnergyPrice(newValue);

            this.send(200, {
                message: 'success'
            });
        }
        catch (e) {
            console.error('Update buy energy price error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Вовзращает значение параметра количества энергии, начисляемой организации за посещение ее страницы
     */
    getEnergyToOrgForOrgVisit() {
        try {
            const energy = EnergyParamsFacade.getEnergyToOrgForOrgVisit();

            this.send(200, {
                energy: energy
            });
        }
        catch (e) {
            console.error('Get energy to org for org visit error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обновляет значение параметра количества энергии, начисляемой организации за посещение ее страницы
     */
    updateEnergyToOrgForOrgVisit() {
        const validate = this.has([
            'newValue'
        ]);

        if (validate === false) {
            return;
        }
        
        try {
            const newValue = parseInt(this.request.body.newValue);

            EnergyParamsFacade.updateEnergyToOrgForOrgVisit(newValue);

            this.send(200, {
                message: 'success'
            });
        }
        catch (e) {
            console.error('Update energy to org for org visit error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}