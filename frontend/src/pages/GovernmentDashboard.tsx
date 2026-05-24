import axios from "axios";
import { useEffect, useState } from "react";
import './GovernmentDashboard.css';

export default function GovernmentDashboard() {
    const ROOT_ORG_TYPES = [
        'Производственная', 
        'Коммерческая', 
        'Административная', 
        'Образовательная', 
        'Волонтёрская', 
        'Спортивная', 
        'Свободная'
    ] as const;
    type OrgFormValues = Record<typeof ROOT_ORG_TYPES[number], 0>;

    const [usersTax, setUsersTax] = useState<number>(0);

    // Налоги организаций
    const [orgsTaxes, setOrgsTaxes] = useState<OrgFormValues>(() => {
        return Object.fromEntries(ROOT_ORG_TYPES.map(t => [t, 0])) as OrgFormValues
    });

    useEffect(() => {
        fetchUsersTax();
        fetchOrgTax();
    }, []);

    

    // Получает значение налога пользователей
    const fetchUsersTax = async () => {
        const result = await axios.get('/api/taxes/users');
        const tax = result.data.tax;
        setUsersTax(tax);
    }

    // Получает значение налога организации
    const fetchOrgTax = async() => {
        const result = await axios.get('/api/taxes/orgs/all');
        const taxes = result.data.taxes;
        setOrgsTaxes(taxes);
    }

    // Обрабатывает изменение ввода налога пользователя
    const handleChangeUsersTax = (e: any) => {
        const newValue = e.target.value;
        setUsersTax(newValue);
    }

    // Отправляет запрос на обновление налога пользователя
    const handleBlurUsersTax = (e: any) => {
        let newValue = e.target.value;

        if (newValue === '') {
            newValue = 0;
            setUsersTax(newValue);
        }

        axios.post('/api/taxes/users', {
            newTax: newValue
        });
    }

    // Обрабатывает изменение ввода налога организации
    const handleChangeOrgsTaxes = (e: any) => {
        const orgType = e.target.getAttribute('data-type');
        const newTax = e.target.value;

        setOrgsTaxes(prev => ({ ...prev, [orgType as keyof OrgFormValues]: newTax }));
    }

    // Отправляет запрос на обновление налога организации
    const handleBlurOrgsTaxes = (e: any) => {
        const orgType = e.target.getAttribute('data-type');
        let newTax = e.target.value;

        if (newTax === '') {
            newTax = 0;
            setOrgsTaxes(prev => ({ ...prev, [orgType as keyof OrgFormValues]: newTax }));
        }

        axios.post('/api/taxes/orgs', {
            orgType: orgType,
            newTax: newTax
        });
    }

    return (
        <div className="dashboard-wrapper" id="government-dashboard">
            <h1>
                Правительство
            </h1>

            <div className="general-params-wrapper">
                <div className="general-param">
                    <p>
                        Налог для пользователей, %
                    </p>
                    <input 
                        type="number" 
                        value={usersTax}
                        onChange={handleChangeUsersTax}
                        onBlur={handleBlurUsersTax}
                    />
                </div>
            </div>

            <div className="resources-for-org-creation">
                <h2>
                    Ресурсы и предметы необходимые<br /> для создания организаций
                </h2>
                <div className="resources-table">
                    <div className="resources-table-head">
                        <div className="resources-table-head-ceil resources-table-ceil">
                            <span>Тип организации</span>
                        </div>
                        <div className="resources-table-head-ceil resources-table-ceil">
                            <span>Цена создания</span>
                        </div>
                        <div className="resources-table-head-ceil resources-table-ceil">
                            <span>Энергия</span>
                        </div>
                        <div className="resources-table-head-ceil resources-table-ceil">
                            <span>Ресурсы для создания</span>
                        </div>
                        <div className="resources-table-head-ceil resources-table-ceil">
                            <span>Предметы</span>
                        </div>
                        <div className="resources-table-head-ceil resources-table-ceil">
                            <span>Установить налог</span>
                        </div>
                    </div>
                    <div className="resources-table-content">
                        {
                            ROOT_ORG_TYPES.map(type => {
                                return (
                                    <div className="resources-table-content-row">
                                        <div className="resources-table-content-ceil resources-table-ceil">
                                            <span>{type}</span>
                                        </div>
                                        <div className="resources-table-content-ceil resources-table-ceil">
                                            <input 
                                                type="number"
                                                data-type={type} 
                                            />
                                        </div>
                                        <div className="resources-table-content-ceil resources-table-ceil">
                                            <input 
                                                type="number"
                                                data-type={type} 
                                            />
                                        </div>
                                        <div className="resources-table-content-ceil resources-table-ceil">
                                            <input 
                                                type="number"
                                                data-type={type} 
                                            />
                                        </div>
                                        <div className="resources-table-content-ceil resources-table-ceil">
                                            <input 
                                                type="number"
                                                data-type={type} 
                                            />
                                        </div>
                                        <div className="resources-table-content-ceil resources-table-ceil">
                                            <input 
                                                type="number"
                                                data-type={type} 
                                                value={orgsTaxes[type]}
                                                onChange={handleChangeOrgsTaxes}
                                                onBlur={handleBlurOrgsTaxes}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}