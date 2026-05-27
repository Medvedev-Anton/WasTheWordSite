import { LoansFacade } from "../facades/loans_facade.js";
import { MainController } from "./main_controller.js";

export class LoansController extends MainController {
    constructor(request, response) {
        super(request, response);
    }

    /**
     * Обработчик расчета данных кредита для пользователя
     */
    calcUserLoanData() {
        const validate = this.has([
            'loanSum',
            'bankId'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const sum = parseInt(this.request.body.loanSum);
            const bankId = parseInt(this.request.params.bankId);

            const loanForecast = LoansFacade.entity('users').calcLoanData(bankId, sum);
            
            this.send(200, {
                forecast: loanForecast
            });
        }
        catch (e) {
            console.error('Calc user loan data error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик расчета данных кредита для организации
     */
    calcOrgsLoanData() {
        const validate = this.has([
            'loanSum',
            'bankId'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const sum = parseInt(this.request.body.loanSum);
            const bankId = parseInt(this.request.params.bankId);

            const loanForecast = LoansFacade.entity('orgs').calcLoanData(bankId, sum);
            
            this.send(200, {
                forecast: loanForecast
            });
        }
        catch (e) {
            console.error('Calc user loan data error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}