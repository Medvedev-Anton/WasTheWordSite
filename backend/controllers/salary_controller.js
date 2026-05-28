import { SalaryFacade } from "../facades/salary_facade.js";
import { MainController } from "./main_controller.js";

export default class SalaryController extends MainController {
    constructor (request, response) {
        super(request, response);
    }

    /**
     * Обрабатывает запрос на получение всех сотрудников с их зарплатами
     */
    getEmployeesWithSalaries() {
        const validate = this.has([
            'id'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const orgId = parseInt(this.request.params.id);
            const salaries = SalaryFacade.getOrgSalariesWithNames(orgId);

            this.send(200, {
                salaries: salaries
            });
        }
        catch (e) {
            console.error('Get employees with salaries error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }

    /**
     * Обрабатывает запрос на изменение зарплаты сотрудника
     */
    changeSalary() {
        const validate = this.has([
            'id',
            'userId',
            'newSalary'
        ]);

        if (validate === false) {
            return;
        }

        try {
            const orgId = parseInt(this.request.params.id);
            const userId = parseInt(this.request.body.userId);
            const newSalary = parseInt(this.request.body.newSalary);

            SalaryFacade.updateSalary(userId, orgId, newSalary);
        }
        catch (e) {
            console.error('Chagne employee salary error:', e.message);
            this.send(500, {
                error: 'Server error'
            });
        }
    }
}