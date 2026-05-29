import axios from "axios";
import { useEffect, useState } from "react";
import './TransferFromAdminToOrg.css';

export default function TransferFromAdminToOrg({orgId}) {
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

    // Обрабатывает запрос на перевод
    const fetchTransfer = async () => {
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

    // Обрабатывает нажатие на кнопку перевода
    const handleClickTransferBtn = () => {
        if (adminBalance < sumToTransfer) {
            alert('Недостаточно средств для перевода');
            return;
        }

        fetchTransfer();
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
                Пополнение баланса организации
            </h2>
            <div className="transfer-to-org-balance-content">
                <div className="transfer-to-org-balance-row">
                    <div className="transfer-to-org-balance-row__current-balance">
                        Текущий баланс:
                    </div>
                    <input 
                        type="number" 
                        className="current-balance-input"
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
                        className="current-admin-balance-input"
                        value={adminBalance}
                        readOnly
                    />
                </div>
                <div className="transfer-to-org-balance-row">
                    <div className="transfer-to-org-balance-row__money-to-transfer">
                        Сумма для перевода:
                    </div>
                    <input 
                        type="number" 
                        className="transfer-sum-input"
                        value={sumToTransfer}
                        onChange={changeSumToTransfer}
                    />
                </div>
            </div>
            <button
                className="sum-to-transfer-btn"
                onClick={handleClickTransferBtn}
            >
                Перевести
            </button>
        </div>
    );
}