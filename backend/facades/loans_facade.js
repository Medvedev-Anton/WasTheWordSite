import { BankOrgParamsMapper } from "../mappers/bank_params/bank_org_params_mapper.js";
import { BankUserParamsMapper } from "../mappers/bank_params/bank_user_params_mapper.js";
import { LoansOrgsMapper } from "../mappers/loans/loans_orgs_mapper.js";
import { LoansUsersMapper } from "../mappers/loans/loans_users_mapper.js";
import { BankParamsService } from "../services/bank_params/bank_params_service.js";
import { LoansService } from "../services/loans_service/loans_service.js";
import { BalanceFacade } from "./balance_facade.js";
import { ProfitFacade } from "./profit_facade.js";
import { db } from "../database/init.js";
import { OrgsFacade } from "./orgs_facade.js";
import { BanksLoansBalanceFacade } from "./banks_loans_balance_facade.js";
import NotificationsFacade from "./notifications_facade.js";

export class LoansFacade {
    constructor(entity) {
        this.entity = entity;

        if (entity === 'users') {
            this.service = new LoansService(
                new LoansUsersMapper()
            );

            this.bankService = new BankParamsService(
                new BankUserParamsMapper()
            );
        }
        else if (entity === 'orgs') {
            this.service = new LoansService(
                new LoansOrgsMapper()
            );

            this.bankService = new BankParamsService(
                new BankOrgParamsMapper()
            );
        }
        else {
            throw new Error('Неизвестная сущность заемщика: ' + entity);
        }
    }

    static entity(entity) {
        return new this(entity);
    }

    /**
     * Получить ID всех заемщиков кредитора
     * @param {int} creditorId
     */
    getAllBorrowersByCreditor(creditorId) {
        try {
            return this.service.getAllBorrowersByCreditor(creditorId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Вычисляет финальную сумму кредита
     * @param {number} sum
     * @param {number} percents
     * @param {number} days
     * @return {number}
     */
    calcFinalSum(sum, percents, days) {
        try {
            return this.service.calcFinalSum(sum, percents, days);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Вычисляет ежедневный платеж
     * @param {number} sum
     * @param {number} days
     * @return {number}
     */
    calcDailyPayment(sum, days) {
        try {
            return this.service.calcDailyPayment(sum, days);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Вычисляет все данные кредита пользователя
     * @param {number} bankId
     * @param {number} sum
     */
    calcLoanData(bankId, sum) {
        const bankParams = this.bankService.getBankEntityParams(bankId);
        
        if (bankParams === null) {
            throw new Error('Невозможно вычислить кредит: отсутствует запись в БД');
        }

        const percent = parseFloat(bankParams.percent);
        const during = parseInt(bankParams.during);
        
        const finalSum = this.calcFinalSum(sum, percent, during);
        const dailyPayment = this.calcDailyPayment(finalSum, during);

        return {
            finalSum: finalSum,
            during: during,
            percent: percent,
            dailyPayment: dailyPayment
        };
    }

    /**
     * Создать данные о кредите
     * @param {number} creditorId
     * @param {number} borrowerId
     * @param {number} startSum
     * @param {number} sumToPay
     * @param {number} paymentSum
     */
    createLoan(creditorId, borrowerId, startSum, sumToPay, paymentSum) {
        try {
            const transation = db.transaction(() => {
                try {
                    this.service.createLoan(creditorId, borrowerId, startSum, sumToPay, paymentSum);
                    BanksLoansBalanceFacade.decrement(creditorId, startSum);
                    BalanceFacade.entity(this.entity).increment(borrowerId, startSum);
                }
                catch (e) {
                    throw new Error(e.message);
                }
            });

            try {
                transation();
            }
            catch (e) {
                throw new Error('ошибка выполнения транзакции по обработке поступления: ' + e.message);
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Списать платеж по кредиту у сущности
     * @param {number} entityId
     * @param {number} bankId
     */
    getLoanPayment(entityId, bankId) {
        try {
            const transaction = db.transaction(() => {
                try {
                    const paymentSum = this.service.getPaymentSum(entityId);

                    this.service.decrementLoanSum(entityId);
                    BalanceFacade.entity(this.entity).decrement(entityId, paymentSum);
                    ProfitFacade.entity('orgs').orgType('Банковская').processWithTax(bankId, paymentSum);

                    const currentLoanSum = this.service.getCurrentSum(entityId);
                    if (currentLoanSum <= 0) {
                        this.service.delete(entityId, bankId);
                    }
                }
                catch (e) {
                    throw new Error(e.message);
                }
            });

            try {
                transaction();
            }
            catch (e) {
                throw new Error('ошибка выполнения транзакции по обработке списания платежа по кредиту: ' + e.message);
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Списывает платеж по кредиту у всех заемщиков
     * @param {number} creditorId
     */
    getAllBorrowersPayment(creditorId) {
        try {
            const borrowers = this.service.getAllBorrowersByCreditor(creditorId);

            borrowers.forEach(borrower => {
                this.getLoanPayment(borrower.borrowerId, creditorId);
            });
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Списывает платежи по кредиту у всех банков и всех заемщиков
     */
    static getAllBanksBorrowersPayments() {
        try {
            const allBanksIds = OrgsFacade.getAllOrgsByType('Банковская');

            allBanksIds.forEach(bank => {
                LoansFacade.entity('users').getAllBorrowersPayment(bank.id);
                const borrowersUsers = LoansFacade.entity('users').getAllBorrowersByCreditor(bank.id);
                borrowersUsers.forEach(borrower => {
                    NotificationsFacade.create(borrower.borrowerId, `У вас списан платеж по кредиту: ${borrower.paymentSum / 100}$`);
                });

                LoansFacade.entity('orgs').getAllBorrowersPayment(bank.id);
                const borrowersOrgs = LoansFacade.entity('orgs').getAllBorrowersByCreditor(bank.id);
                borrowersOrgs.forEach(borrower => {
                    const adminId = OrgsFacade.getAdminId(borrower.borrowerId);
                    NotificationsFacade.create(adminId, `У вас списан платеж по кредиту вашей организации: ${borrower.paymentSum / 100}$`);
                });
            });
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    /**
     * Проверяет наличие кредитов у пользователя
     * @param {number} userId
     */
    static isUserLoanExists(userId) {
        try {
            const service = new LoansService(
                new LoansUsersMapper()
            );
            return service.isUserLoanExists(userId);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}