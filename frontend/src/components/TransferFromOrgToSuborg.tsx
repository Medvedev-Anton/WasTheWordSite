import { useEffect, useState } from 'react';
import axios from 'axios';
import './TransferFromOrgToSuborg.css';

export default function TransferFromOrgToSuborg({ orgId }) {
    const [suborgsBalances, setSuborgsBalances] = useState<Record<string, Record<any, any>>>({});
    const [addingSuborgBalance, setAddingSuborgBalance] = useState<Record<string, Record<any, any>>>({});

    useEffect(() => {
        fetchSuborgsWithBalances();
    }, []);

    useEffect(() => {
        Object.entries(suborgsBalances).map(([name, org]) => {
            setAddingSuborgBalance(prev => (
                {
                    ...prev,
                    [name as string]: {
                        id: org.id,
                        adding: 0
                    }
                }
            ));
        });
    }, [suborgsBalances]);

    // Запрос на получение балансов подорганизаций
    const fetchSuborgsWithBalances = async() => {
        const result = await axios.get(`/api/organizations/${orgId}/suborgs-with-balances`);
        const orgs = result.data.suborgs;

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

        setSuborgsBalances(normalized);
    }

    // Обрабатывает изменение поля с добавлением к балансу подорганизации
    const handleChangeAddingToOrgBalance = (e: any) => {
        const addingValue = e.target.value;
        const name = e.target.getAttribute('data-name');
        const id = e.target.getAttribute('data-id');

        setAddingSuborgBalance(prev => (
            {
                ...prev,
                [name as string]: {
                    id: id,
                    adding: addingValue
                }
            }
        ));
    }

    // Отправляет запрос на добавление суммы к текущему балансу подорганизации
    const fetchAddingToOrgBalance = async (e: any) => {
        const addingBalance = e.target.value;
        const suborgId = e.target.getAttribute('data-id');

        const result = await axios.post(`/api/organizations/${orgId}/transfer-to-suborg`, {
            sum: addingBalance * 100,
            suborgId: suborgId
        });

        if (result.data.message === 'notEnoughMoney') {
            alert('Недостаточно средств для перевода');
            return;
        }

        fetchSuborgsWithBalances();
    }

    return (
        <div className="suborgs-management">
            {
                Object.keys(suborgsBalances).length != 0
                ?
                <div>
                    <h2>
                        Управление подорганизациями
                    </h2>
                    <div className="suborgs-management-table">
                        <div className="suborgs-management-table-head">
                            <div className="suborgs-management-table-head-ceil suborgs-management-table-ceil suborgs-management-table-ceil-first">
                                <span>
                                    Название
                                </span>
                            </div>
                            <div className="suborgs-management-table-head-ceil suborgs-management-table-ceil">
                                <span>
                                    Выделить на развитие
                                </span>
                            </div>
                            <div className="suborgs-management-table-head-ceil suborgs-management-table-ceil">
                                <span>
                                    Бюджет подорганизации
                                </span>
                            </div>
                        </div>
                        <div className="suborgs-management-table-content">
                            {
                                Object.entries(suborgsBalances).map(([name, org]) => (
                                        <div className="suborgs-management-table-content-row" key={name}>
                                            <div className="suborgs-management-table-content-ceil suborgs-management-table-ceil suborgs-management-table-ceil-first">
                                                <span>{name}</span>
                                            </div>
                                            <div className="suborgs-management-table-content-ceil suborgs-management-table-ceil">
                                                <input 
                                                    type="number" 
                                                    className="input-with-dollar-back"
                                                    value={addingSuborgBalance[name]?.adding ?? 0}
                                                    data-name={name}
                                                    data-id={org.id}
                                                    onChange={handleChangeAddingToOrgBalance}
                                                    onBlur={fetchAddingToOrgBalance}
                                                />
                                            </div>
                                            <div className="suborgs-management-table-content-ceil suborgs-management-table-ceil">
                                                <input 
                                                    type="number" 
                                                    className="input-with-dollar-back"
                                                    readOnly
                                                    value={suborgsBalances[name].balance}
                                                />
                                            </div>
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>
                :
                ""
            }
            
        </div>
    );
}