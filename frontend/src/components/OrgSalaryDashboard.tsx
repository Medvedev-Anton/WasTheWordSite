import axios from "axios";
import { useEffect, useState } from "react";
import './OrgSalaryDashboard.css';

export default function OrgSalaryDashboard({orgId}) {
    useEffect(() => {
        fetchEmployeesWithSalaries();
    }, []);

    const [salaries, setSalaries] = useState<Record<any, any>>({});

    // Получает всех сотрудников организации с их зарплатами
    const fetchEmployeesWithSalaries = async () => {
        const result = await axios.get(`/api/organizations/${orgId}/salaries`);

        const normalizedSalaries = Object.entries(result.data.salaries).reduce(
            (acc, [username, data]: [string, any]) => ({
                ...acc,
                [username]: {
                    ...data,
                    salary: Number(data.salary) / 100
                }
            }),
            {} as Record<string, { salary: number; userId: string }>
        );

        setSalaries(normalizedSalaries);
    }

    // Обрабатывает изменение зарплаты
    const handleChangeSalary = (e: any) => {
        const newSalary = e.target.value;
        const username = e.target.getAttribute('data-user-name');
        const userId = e.target.getAttribute('data-user-id');
        
        setSalaries(prev => (
            {
                ...prev,
                [username as string]: {
                    salary: newSalary,
                    userId: userId
                }
            }
        ));
    }

    // Отправляет запрос на изменение зарплаты сотрудника
    const handleBlurSalary = (e: any) => {
        const newSalary = e.target.value;
        const username = e.target.getAttribute('data-user-name');
        const userId = e.target.getAttribute('data-user-id');

        if (newSalary === '') {
            setSalaries(prev => (
                {
                    ...prev,
                    [username as string]: {
                        salary: 0,
                        userId: userId
                    }
                }
            ));
        }

        axios.post(`/api/organizations/${orgId}/salaries/update`, {
            userId: userId,
            newSalary: newSalary * 100
        });
    }

    return (
        <div className="org-salary-wrapper">
            <h2>Зарплата сотрудникам</h2>

            <div className="org-salary-rows">
                {
                    Object.entries(salaries).map(([username, salary]) => (
                        <div className="salary-row">
                            <div className="salary-username">
                                {username}
                            </div>
                            <div className="salary-value">
                                <input 
                                    type="number" 
                                    data-user-id={salaries[username].userId}
                                    data-user-name={username}
                                    value={salaries[username].salary}
                                    onChange={handleChangeSalary}
                                    onBlur={handleBlurSalary}
                                />
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}