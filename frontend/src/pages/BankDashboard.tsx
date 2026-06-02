import { useEffect, useState } from 'react';
import './BankDashboard.css';
import { useParams } from 'react-router-dom';
import { Organization } from '../types';
import axios from 'axios';
import OrgBalanceDiagram from '../components/OrgBalanceDiagram';
import TransferFromAdminToOrg from '../components/TransferFromAdminToOrg';

interface Borrower {
    borrowerId: number,
    name: string,
    percent: number
}

export default function BankDashboard() {
    const { id } = useParams();
    const [org, setOrg] = useState<Organization | null>(null);

    const [loanOrgsPercent, setLoanOrgsPercent] = useState<number>(0);
    const [loanOrgsDuring, setLoanOrgsDuring] = useState<number>(0);

    const [loanUsersPercent, setLoanUsersPercent] = useState<number>(0);
    const [loanUsersDuring, setLoanUsersDuring] = useState<number>(0);

    const [orgsBorrowers, setOrgsBorrowers] = useState<Borrower[]>([]);
    const [usersBorrowers, setUsersBorrowers] = useState<Borrower[]>([]);

    const [mainBalance, setMainBalance] = useState<number>(0);
    const [loanBalance, setLoanBalance] = useState<number>(0);
    const [sumToTransfer, setSumToTransfer] = useState<number>(0);

    useEffect(() => {
        if (id !== undefined) {
            const ID = parseInt(id);

            fetchOrg(ID);
            fetchBankParams(ID);
            fetchOrgsBorrowers(ID);
            fetchUsersBorrowers(ID);
            fetchMainBalance(ID);
            fetchLoanBalance(ID);
        }
    }, [id]);

    // Получает основной баланс
    const fetchMainBalance = async (id: number) => {
        const result = await axios.get(`/api/organizations/${id}/balance`);
        const balance = +(parseFloat(result.data.balance || 0) / 100).toFixed(2); 
        setMainBalance(balance);
    }

    // Получает кредитный баланс банка
    const fetchLoanBalance = async (id: number) => {
        const result = await axios.get(`/api/banks/${id}/loan-balance`);
        const balance = +(parseFloat(result.data.balance || 0) / 100).toFixed(2); 
        setLoanBalance(balance);
    }

    // Обрабатывает изменение суммы перевода между счетами
    const handleChangeTransferSum = (e: any) => {
        setSumToTransfer(e.target.value);
    }

    // Отправляет запрос на перевод между счетами банка
    const fetchTransferBetweeBalances = async (id: number | undefined) => {
        axios.post(`/api/banks/${id}/tranfer-from-main-to-loan-balance`, {
            sum: sumToTransfer * 100
        });
    }

    // Обрабатывает нажатие на кнопку перевода с кредитного баланса на основной баланс
    const hangleClickTransferBetweenBalances = () => {
        if (loanBalance > mainBalance) {
            alert('Недостаточно средств');
            return;
        }

        const ID = org?.id;

        if (ID !== undefined) {
            fetchTransferBetweeBalances(ID);
            fetchMainBalance(ID);
            fetchLoanBalance(ID);
        }        
    }

    // Устанавливает данные организации
    const fetchOrg = async (id: number) => {
        const orgData = await axios.get(`/api/organizations/${id}`);
        setOrg(orgData.data);
    }

    // Устанавливает кредитные параметры панка
    const fetchBankParams = async(id: number) => {
        const paramsResult = await axios.get(`/api/banks/${id}/params`);
        const params = paramsResult.data.params;
        
        const orgsPercent = params.loan_percent_orgs || 0;
        const orgsDuring = params.loan_during_days_orgs || 0;
        const usersPercent = params.loan_percent_users || 0;
        const usersDuring = params.loan_during_days_users || 0;

        setLoanOrgsPercent(orgsPercent);
        setLoanOrgsDuring(orgsDuring);
        setLoanUsersPercent(usersPercent);
        setLoanUsersDuring(usersDuring);
    }

    // Устанавливает список заемщиков-организаций
    const fetchOrgsBorrowers = async(id: number) => {
        const result = await axios.get(`/api/banks/${id}/borrowers/orgs`);
        const borrowers = result.data.borrowers;
        setOrgsBorrowers(borrowers);
    }

    // Устанавливает список заемщиков-пользователей
    const fetchUsersBorrowers = async(id: number) => {
        const result = await axios.get(`/api/banks/${id}/borrowers/users`);
        const borrowers = result.data.borrowers;
        setUsersBorrowers(borrowers);
    }

    // Обновляет параметры банков в БД
    const fetchUpdateOrgsPercent = (percent: number) => {
        axios.post(`/api/banks/${id}/params/orgs-loan-percent`, {
            newPercent: percent
        });
    }
    const fetchUpdateOrgsDuring = (newDuringDays: number) => {
        axios.post(`/api/banks/${id}/params/orgs-loan-during`, {
            newDuringDays: newDuringDays
        });
    }
    const fetchUpdateUsersPercent = (percent: number) => {
        axios.post(`/api/banks/${id}/params/users-loan-percent`, {
            newPercent: percent
        });
    }
    const fetchUpdateUsersDuring = (newDuringDays: number) => {
        axios.post(`/api/banks/${id}/params/users-loan-during`, {
            newDuringDays: newDuringDays
        });
    }

    // Обработка изменения инпутов параметров
    const handleOrgsPercentChange = (e: any) => {
        const value = e.target.value;

        setLoanOrgsPercent(value);
    }
    const handleOrgsPercentUpdate = (e: any) => {
        let value = e.target.value;

        if (value === '') {
            value = 0;
            setLoanOrgsPercent(value);
        }

        fetchUpdateOrgsPercent(value);
    }

    const handleOrgsDuringChange = (e: any) => {
        const value = e.target.value;

        setLoanOrgsDuring(value);
    }
    const handleOrgsDuringUpdate = (e: any) => {
        let value = e.target.value;

        if (value === '') {
            value = 0;
            setLoanOrgsDuring(value);
        }

        fetchUpdateOrgsDuring(value);
    }

    const handleUsersPercentChange = (e: any) => {
        const value = e.target.value;

        setLoanUsersPercent(value);
    }
    const handleUsersPercentUpdate = (e: any) => {
        let value = e.target.value;

        if (value === '') {
            value = 0;
            setLoanUsersPercent(value);
        }

        fetchUpdateUsersPercent(value);
    }

    const handleUsersDuringChange = (e: any) => {
        const value = e.target.value;

        setLoanUsersDuring(value);
    }
    const handleUsersDuringUpdate = (e: any) => {
        let value = e.target.value;

        if (value === '') {
            value = 0;
            setLoanUsersDuring(value);
        }

        fetchUpdateUsersDuring(value);
    }

    return (
        <div className="dashboard-wrapper" id="bank-dashboard">
            <h1>Управление банком</h1>
            <TransferFromAdminToOrg orgId={id} />
            <div className="tansfer-between-bank-balances">
                <h2>
                    Перевод с основного на кредитный баланс
                </h2>

                <div className="tansfer-between-bank-balances-content">
                    <div className="tansfer-between-bank-balances__bank-balance">
                        <div className="tansfer-between-bank-balances__bank-balance-title">
                            Основной баланс:
                        </div>
                        <input 
                            type="number" 
                            className="tansfer-between-bank-balances__bank-balance-input input-with-dollar-back"
                            value={mainBalance}
                            readOnly
                        />
                    </div>
                    <div className="tansfer-between-bank-balances__bank-balance">
                        <div className="tansfer-between-bank-balances__bank-balance-title">
                            Кредитный баланс:
                        </div>
                        <input 
                            type="number" 
                            className="tansfer-between-bank-balances__bank-balance-input input-with-dollar-back"
                            value={loanBalance}
                            readOnly
                        />
                    </div>
                    <div className="tansfer-between-bank-balances__bank-balance">
                        <div className="tansfer-between-bank-balances__bank-balance-title">
                            Сумма перевода:
                        </div>
                        <input 
                            type="number" 
                            className="tansfer-between-bank-balances__bank-balance-input input-with-dollar-back"
                            value={sumToTransfer}
                            onChange={handleChangeTransferSum}
                        />
                    </div>
                    <button 
                        onClick={hangleClickTransferBetweenBalances}
                        className="transfer-between-balances-btn"
                    >
                        Перевести
                    </button>
                </div>
            </div>
            <div className="loan-params-wrapper">
                <div className="loan-params-orgs loan-params-list">
                    <h3>
                        Организации
                    </h3>

                    <div className="loan-param">
                        <p>Процент кредита для организаций, %</p>
                        <input 
                            type="number"   
                            name="loan-orgs-percent" 
                            value={loanOrgsPercent}
                            onChange={handleOrgsPercentChange}
                            onBlur={handleOrgsPercentUpdate}
                        />
                    </div>
                    <div className="loan-param">
                        <p>Срок кредита для организаций, дни</p>
                        <input 
                            type="number" 
                            name="loan-orgs-during" 
                            value={loanOrgsDuring}
                            onChange={handleOrgsDuringChange}
                            onBlur={handleOrgsDuringUpdate}
                        />
                    </div>
                </div>
                <div className="loan-params-users loan-params-list">
                    <h3>
                        Пользователи
                    </h3>

                    <div className="loan-param">
                        <p>Процент кредита для пользователей, %</p>
                        <input 
                            type="number" 
                            name="loan-users-percent" 
                            value={loanUsersPercent}
                            onChange={handleUsersPercentChange}
                            onBlur={handleUsersPercentUpdate}
                        />
                    </div>
                    <div className="loan-param">
                        <p>Срок кредита для пользователей, дни</p>
                        <input 
                            type="number" 
                            name="loan-users-during" 
                            value={loanUsersDuring}
                            onChange={handleUsersDuringChange}
                            onBlur={handleUsersDuringUpdate}
                        />
                    </div>
                </div>
            </div>
            <div className="borrowers-wrapper">
                <div className="borrowers-orgs borrowers-list">
                    <h2>Организации взявшие кредит, %</h2>

                    {
                        orgsBorrowers.map(borrower => {
                            return (
                                <div className="borrower-elem" key={borrower.borrowerId}>
                                    <span className="borrower-name">
                                        {borrower.name}
                                    </span>
                                    <input 
                                        type="number"
                                        readOnly
                                        value={Math.round(borrower.percent)}
                                        step="any" 
                                        className="orgLoanPaymentPercent"
                                    />
                                </div>
                            )
                        })
                    }
                </div>
                <div className="borrowers-users borrowers-list">
                    <h2>Пользователи взявшие кредит, %</h2>

                    {
                        usersBorrowers.map(borrower => {
                            return (
                                <div className="borrower-elem" key={borrower.borrowerId}>
                                    <span className="borrower-name">
                                        {borrower.name}
                                    </span>
                                    <input 
                                        type="number"
                                        readOnly
                                        value={Math.round(borrower.percent)}
                                        step="any" 
                                        className="orgLoanPaymentPercent"
                                    />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <OrgBalanceDiagram orgId={id} />
        </div>
    );
}