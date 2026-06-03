import axios from "axios";
import { useEffect, useState } from "react";
import './GovernmentDashboard.css';
import { useParams } from "react-router-dom";
import OrgBalanceDiagram from "../components/OrgBalanceDiagram";
import TransferFromOrgToSuborg from "../components/TransferFromOrgToSuborg";

export default function GovernmentDashboard() {
    const ROOT_ORG_TYPES = [
        'Производственная', 
        'Коммерческая', 
        'Административная', 
        'Образовательная', 
        'Волонтёрская', 
        'Спортивная', 
        'Свободная',
        'Банковская'
    ] as const;
    type OrgFormValues = Record<typeof ROOT_ORG_TYPES[number], 0>;

    const { id } = useParams();
    const [usersTax, setUsersTax] = useState<number>(0);
    const [orgsTaxes, setOrgsTaxes] = useState<OrgFormValues>(() => {
        return Object.fromEntries(ROOT_ORG_TYPES.map(t => [t, 0])) as OrgFormValues
    });
    const [orgsCreationPrices, setOrgsCreationPrices] = useState<OrgFormValues>(() => {
        return Object.fromEntries(ROOT_ORG_TYPES.map(t => [t, 0])) as OrgFormValues
    });
    const [orgsBalances, setOrgsBalances] = useState<Record<string, Record<any, any>>>({});
    const [addingOrgBalance, setAddingOrgBalance] = useState<Record<string, Record<any, any>>>({});
    const [postViewPrice, setPostViewPrice] = useState<number>(0);

    useEffect(() => {
        fetchUsersTax();
        fetchOrgTax();
        fetchAllOrgsCreationPrices();
        fetchAllOrgsWithBalances();
        fetchPostViewPrice();
    }, []);

    useEffect(() => {
        Object.entries(orgsBalances).map(([name, org]) => {
            setAddingOrgBalance(prev => (
                {
                    ...prev,
                    [name as string]: {
                        id: org.id,
                        adding: 0
                    }
                }
            ));
        });
    }, [orgsBalances]);

    /* Налог пользователя */

    // Получает значение налога пользователей
    const fetchUsersTax = async () => {
        const result = await axios.get('/api/taxes/users');
        const tax = result.data.tax;
        setUsersTax(tax);
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

    // Обрабатывает изменение ввода налога пользователя
    const handleChangeUsersTax = (e: any) => {
        const newValue = e.target.value;
        setUsersTax(newValue);
    }

    /* Цена за просмотр поста */

    // Получает значение цены за просмотр поста
    const fetchPostViewPrice = async() => {
        const result = await axios.get('/api/prices/post-view');
        const price = result.data.price;
        setPostViewPrice(price / 100);
    }

    // Обрабатывает изменение цены за просмотр поста
    const handleChangePostViewPrice = (e: any) => {
        const newPrice = e.target.value;
        setPostViewPrice(newPrice);
    }

    // Отправляет запрос на изменение цены за просмотр поста
    const fetchUpdatePostViewPrice = (e: any) => {
        let newPrice = e.target.value;

        if (newPrice === '') {
            newPrice = 0;
            setPostViewPrice(0);
        }

        axios.post('/api/prices/post-view', {
            newPrice: newPrice * 100
        });
    }

    /* Налоги организаций */

    // Получает значение налогов всех организаций
    const fetchOrgTax = async() => {
        const result = await axios.get('/api/taxes/orgs/all');
        const taxes = result.data.taxes;
        setOrgsTaxes(taxes);
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

    /* Цены создания организаций */

    // Получает цены создания всех организаций
    const fetchAllOrgsCreationPrices = async() => {
        const result = await axios.get('/api/orgs/creation-prices/all');
        const prices = result.data.prices;

        const normalized = Object.entries(prices).reduce(
            (acc, [orgType, price]: [string, any]) => ({
                ...acc,
                [orgType]: price / 100
            }),
            {} as OrgFormValues
        );

        setOrgsCreationPrices(normalized);
    } 

    // Обрабатывает изменение цены создания организации
    const handleChangeOrgCreationPrice = (e: any) => {
        const orgType = e.target.getAttribute('data-type');
        const newPrice = e.target.value;

        setOrgsCreationPrices(prev => ({ ...prev, [orgType as keyof OrgFormValues]: newPrice }));
    }

    // Отправляет запрос на обновление цены создания организации
    const fetchBlurOrgCreationPrice = (e: any) => {
        const orgType = e.target.getAttribute('data-type');
        let newPrice = e.target.value;

        if (newPrice === '') {
            newPrice = 0;
            setOrgsCreationPrices(prev => ({ ...prev, [orgType as keyof OrgFormValues]: newPrice }));
        }

        axios.post('/api/orgs/creation-prices', {
            orgType: orgType,
            newPrice: newPrice * 100
        });
    }

    /* Бюджеты организаций */
    
    // Получает список всех организаций с бюджетами
    const fetchAllOrgsWithBalances = async() => {
        const result = await axios.get('/api/organizations/all-with-balance');
        const orgs = result.data.orgs;

        const normalized = Object.entries(orgs).reduce(
            (acc, [orgName, data]: [string, any]) => ({
                ...acc,
                [orgName]: {
                    ...data,
                    balance: Number(data.balance) / 100
                }
            }),
            {} as Record<string, { balance: number; id: number }>
        );

        setOrgsBalances(normalized);
    }

    // Обрабатывает изменение бюджета организации
    const handleChangeOrgBalance = (e: any) => {
        const newBalance = e.target.value;
        const orgName = e.target.getAttribute('data-name');
        const id = e.target.getAttribute('data-id');

        setOrgsBalances(prev => (
            {
                ...prev,
                [orgName as string]: {
                    id: id,
                    balance: newBalance
                }
            }
        ));
    } 

    // Отправляет запрос на обновление бюджета организации
    const fetchUpdateOrgBalance = (e: any) => {
        let newBalance = e.target.value;
        const orgName = e.target.getAttribute('data-name');
        const id = e.target.getAttribute('data-id');

        if (newBalance === '') {
            newBalance = 0;
                setOrgsBalances(prev => (
                {
                    ...prev,
                    [orgName as string]: {
                        id: id,
                        balance: newBalance
                    }
                }
            ));
        }

        axios.post(`/api/organizations/${id}/balance`, {
            id: id,
            newBalance: newBalance * 100
        });
    }

    // Обрабатывает изменение поля с добавлением к балансу организации
    const handleChangeAddingToOrgBalance = (e: any) => {
        const addingValue = e.target.value;
        const name = e.target.getAttribute('data-name');
        const id = e.target.getAttribute('data-id');

        setAddingOrgBalance(prev => (
            {
                ...prev,
                [name as string]: {
                    id: id,
                    adding: addingValue
                }
            }
        ));
    }

    // Отправляет запрос на добавление суммы к текущему балансу организации
    const fetchAddingToOrgBalance = (e: any) => {
        const addingBalance = e.target.value;
        const id = e.target.getAttribute('data-id');

        axios.post(`/api/organizations/${id}/balance/adding`, {
            addingBalance: addingBalance * 100
        });

        fetchAllOrgsWithBalances();
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

                <div className="general-param">
                    <p>
                        Цена просмотра поста
                    </p>
                    <input 
                        type="number" 
                        className="input-with-dollar-back"
                        value={postViewPrice}
                        onChange={handleChangePostViewPrice}
                        onBlur={fetchUpdatePostViewPrice}
                    />
                </div>
            </div>

            <TransferFromOrgToSuborg orgId={id} />

            <div className="orgs-management">
                <h2>
                    Управление всеми организациями
                </h2>
                <div className="orgs-management-wrapper">
                    <div className="gover-statistic">
                        <h3>
                            Правительственная организация
                        </h3>
                        <div className="gover-balance-diagram">
                            <OrgBalanceDiagram orgId={id} />
                        </div>
                    </div>
                    <div className="created-orgs-wrapper">
                        <h3>
                            Созданные организации
                        </h3>
                        <div className="orgs-management-table">
                            <div className="orgs-management-table-head">
                                <div className="orgs-management-table-head-ceil orgs-management-table-ceil orgs-management-table-ceil-first">
                                    <span>
                                        Название
                                    </span>
                                </div>
                                <div className="orgs-management-table-head-ceil orgs-management-table-ceil">
                                    <span>
                                        Выделить на развитие
                                    </span>
                                </div>
                                <div className="orgs-management-table-head-ceil orgs-management-table-ceil">
                                    <span>
                                        Бюджет организации
                                    </span>
                                </div>
                            </div>
                            <div className="orgs-management-table-content">
                                {
                                    Object.entries(orgsBalances).map(([name, org]) => (
                                            <div className="orgs-management-table-content-row" key={name}>
                                                <div className="orgs-management-table-content-ceil orgs-management-table-ceil orgs-management-table-ceil-first">
                                                    <span>{name}</span>
                                                </div>
                                                <div className="orgs-management-table-content-ceil orgs-management-table-ceil">
                                                    <input 
                                                        type="number" 
                                                        className="input-with-dollar-back"
                                                        value={addingOrgBalance[name]?.adding ?? 0}
                                                        data-name={name}
                                                        data-id={org.id}
                                                        onChange={handleChangeAddingToOrgBalance}
                                                        onBlur={fetchAddingToOrgBalance}
                                                    />
                                                </div>
                                                <div className="orgs-management-table-content-ceil orgs-management-table-ceil">
                                                    <input 
                                                        type="number" 
                                                        className="input-with-dollar-back"
                                                        value={org.balance}
                                                        data-name={name}
                                                        data-id={org.id}
                                                        onChange={handleChangeOrgBalance}
                                                        onBlur={fetchUpdateOrgBalance}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="resources-for-org-creation">
                <h2>
                    Ресурсы и предметы необходимые<br /> для создания организаций
                </h2>
                <div className="resources-table">
                    <div className="resources-table-head">
                        <div className="resources-table-head-ceil resources-table-ceil resources-table-ceil-first">
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
                            <span>Установить налог, %</span>
                        </div>
                    </div>
                    <div className="resources-table-content">
                        {
                            ROOT_ORG_TYPES.map(type => {
                                return (
                                    <div className="resources-table-content-row">
                                        <div className="resources-table-content-ceil resources-table-ceil resources-table-ceil-first">
                                            <span>{type}</span>
                                        </div>
                                        <div className="resources-table-content-ceil resources-table-ceil">
                                            <input 
                                                type="number"
                                                className="input-with-dollar-back"
                                                data-type={type} 
                                                value={orgsCreationPrices[type]}
                                                onChange={handleChangeOrgCreationPrice}
                                                onBlur={fetchBlurOrgCreationPrice}
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