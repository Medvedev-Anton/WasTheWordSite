import { BalanceFacade } from "../facades/balance_facade.js";
import { BanksLoansBalanceFacade } from "../facades/banks_loans_balance_facade.js";
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
            const sum = parseFloat(this.request.body.loanSum);
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
            const sum = parseFloat(this.request.body.loanSum);
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

    /**
     * Обработчик создания кредита пользователя
     */
    createUserLoan() {
        const validate = this.has([
            'bankId',
            'loanSum',
            'paymentSum',
            'sumToPay'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const userId = parseInt(this.request.user.userId);
            const isLoanExists = LoansFacade.entity('users').isUserLoanExists(userId);

            if (isLoanExists) {
                return this.send(200, {
                    message: 'anotherLoanExists'
                });
            }

            const bankId = parseInt(this.request.params.bankId);
            const sum = parseFloat(this.request.body.loanSum);

            const currentBankBalance = BanksLoansBalanceFacade.getBalance(bankId);

            if (currentBankBalance < sum) {
                return this.send(200, {
                    'message': 'notEnoughMoney'
                });
            }

            const paymentSum = parseFloat(this.request.body.paymentSum);
            const sumToPay = parseInt(this.request.body.sumToPay);       

            LoansFacade.entity('users').createLoan(bankId, userId, sum, sumToPay, paymentSum);

            this.send(200, {
                'message': 'success'
            });
        }
        catch (e) {
            console.error('Create user loan error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обработчик создания кредита организации
     */
    createOrgsLoan() {
        const validate = this.has([
            'bankId',
            'loanSum',
            'orgId',
            'paymentSum'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const orgId = parseInt(this.request.body.orgId);
            const isLoanExists = LoansFacade.entity('orgs').isUserLoanExists(orgId);

            if (isLoanExists) {
                return this.send(200, {
                    message: 'anotherLoanExists'
                });
            }

            const bankId = parseInt(this.request.params.bankId);
            const sum = parseFloat(this.request.body.loanSum);

            const currentBankBalance = BanksLoansBalanceFacade.getBalance(bankId);

            if (currentBankBalance < sum) {
                return this.send(200, {
                    'message': 'notEnoughMoney'
                });
            }

            const paymentSum = parseFloat(this.request.body.paymentSum);
            const sumToPay = parseInt(this.request.body.sumToPay);     
            
            LoansFacade.entity('orgs').createLoan(bankId, orgId, sum, sumToPay, paymentSum);

            this.send(200, {
                'message': 'success'
            });
        }
        catch (e) {
            console.error('Create user loan error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}