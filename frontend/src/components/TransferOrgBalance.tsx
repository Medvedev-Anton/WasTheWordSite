import axios from "axios";
import { useEffect, useState } from "react";
import './TransferOrgBalance.css';

export default function TransferOrgBalance({orgId}) {
    const [orgBalance, setOrgBalance] = useState<number>(0);
    const [sumToTransfer, setSumToTransfer] = useState<number>(0);
    const [adminBalance, setAdminBalance] = useState<number>(0);

    useEffect(() => {
        fetchOrgBalance(orgId);
        fetchAdminBalance();
    }, []);

    // Получает текущий баланс организации
    const fetchOrgBalance = async (orgId: number) => {
        const result = await axios.get(`/api/organizations/${orgId}/balance`);

        const balance = +(parseFloat(result.data.balance || 0) / 100).toFixed(2);

        setOrgBalance(balance);
    }

    // Обрабатывает изменение суммы для перевода
    const changeSumToTransfer = (e: any) => {
        const value = e.target.value;
        setSumToTransfer(value);
    }

    // Обрабатывает запрос на перевод с баланса админа на баланс организации
    const fetchTransferFromAdminToOrg = async () => {
        const result = await axios.post(`/api/organizations/${orgId}/transfer-from-admin-to-org`, {
            sum: sumToTransfer * 100
        });

        if (result.data.message && result.data.message === 'success') {
            fetchOrgBalance(orgId);
            fetchAdminBalance();
            alert('Пополнение прошло успешно');
        }
        else {
            alert('Ошибка при пополнении баланса');
        }
    }

    // Обрабатывает запрос на перевод с баланса организации на баланс админа
    const fetchTransferFromOrgToAdmin = async () => {
        const result = await axios.post(`/api/organizations/${orgId}/transfer-from-org-to-admin`, {
            sum: sumToTransfer * 100
        });

        if (result.data.message && result.data.message === 'success') {
            fetchOrgBalance(orgId);
            fetchAdminBalance();
            alert('Пополнение прошло успешно');
        }
        else {
            alert('Ошибка при пополнении баланса');
        }
    }

    // Обрабатывает нажатие на кнопку перевода с баланса админа на баланс организации
    const handleClickTransferFromAdminToOrgBtn = () => {
        if (adminBalance < sumToTransfer) {
            alert('Недостаточно средств для перевода');
            return;
        }

        fetchTransferFromAdminToOrg();
    }

    // Обрабатывает нажатие на кнопку перевода с баланса организации на баланс admin
    const handleClickTransferFromOrgToAdminBtn = () => {
        if (adminBalance < sumToTransfer) {
            alert('Недостаточно средств для перевода');
            return;
        }

        fetchTransferFromOrgToAdmin();
    }

    // Получает текущий баланс админа
    const fetchAdminBalance = async () => {
        const result = await axios.get(`/api/users/balance`);

        const balance = +(parseFloat(result.data.balance || 0) / 100).toFixed(2);

        setAdminBalance(balance);
    }

    return (
        <div className="transfer-to-org-balance-wrapper">
            <h2>
                Переводы
            </h2>
            <div className="transfer-to-org-balance-content">
                <div className="transfer-to-org-balance-row">
                    <div className="transfer-to-org-balance-row__current-balance">
                        Текущий баланс:
                    </div>
                    <input 
                        type="number" 
                        className="current-balance-input input-with-dollar-back"
                        value={orgBalance}
                        readOnly
                    />
                </div>
                <div className="transfer-to-org-balance-row">
                    <div className="transfer-to-org-balance-row__current-admin-balance">
                        Баланс админа:
                    </div>
                    <input 
                        type="number" 
                        className="current-admin-balance-input input-with-dollar-back"
                        value={adminBalance}
                        readOnly
                    />
                </div>
                <div className="transfer-to-org-balance-row">
                    <div className="transfer-to-org-balance-row__money-to-transfer">
                        Сумма перевода:
                    </div>
                    <input 
                        type="number" 
                        className="transfer-sum-input input-with-dollar-back"
                        value={sumToTransfer}
                        onChange={changeSumToTransfer}
                    />
                </div>
            </div>
            <button
                className="sum-to-transfer-btn"
                onClick={handleClickTransferFromAdminToOrgBtn}
            >
                Перевести в организацию
            </button>

            <button
                className="sum-to-transfer-btn sum-to-transfer-btn-to-admin"
                onClick={handleClickTransferFromOrgToAdminBtn}
            >
                Вывести с организации
            </button>
        </div>
    );
}