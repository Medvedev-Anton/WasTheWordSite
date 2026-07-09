import { useEffect, useState } from 'react';
import { Organization } from '../types';
import './EnergyTranfserToFromSuborgs.css';
import axios from 'axios';

interface EnergyTranfserToFromSuborgsProps {
    orgId: number;
    suborgs: Organization[] | undefined;
    orgEnergy: number;
}

export default function EnergyTranfserToFromSuborgs(
    {
        orgId,
        suborgs,
        orgEnergy
    }: EnergyTranfserToFromSuborgsProps
) {
    const [selectedSuborgId, setCelectedSuborgId] = useState<number | undefined>(undefined);
    const [countEnergyTranfser, setCountEnergyTranfser] = useState<number>(0);
    const [energy, setEnergy] = useState<number>(0);

    useEffect(() => {
        if (suborgs !== undefined && suborgs?.length !== 0) {
            setCelectedSuborgId(suborgs[0].id);
        }        
    }, [suborgs]);

    useEffect(() => {
        setEnergy(orgEnergy);
    }, [orgEnergy]);

    // Изменение селека подорганизаций
    const handleChangeSuborgsSelect = (e: any) => {
        setCelectedSuborgId(e.target.value);
    }

    // Изменение количества энергии для перевода
    const handleChangeCountEnergyToTransfer = (e: any) => {
        setCountEnergyTranfser(e.target.value);
    }

    // Запрос на перевод из организации в подорганизацию
    const fetchTransferFromOrgToSuborg = async () => {
        try {
            const result = await axios.post('/api/energy/transfer/org-suborg', {
                orgIdFrom: orgId,
                suborgIdTo: selectedSuborgId,
                countEnergy: countEnergyTranfser
            });

            setEnergy(result.data.orgEnergy);
            setCountEnergyTranfser(0);
        }
        catch (e) {
            alert('Не удалось выполнить перевод. Возможно у вас не хватает энергии');
        }
    }

    // Запрос на перевод из подорганизации в организацию
    const fetchTransferFromSuborgToOrg = async () => {
        try {
            const result = await axios.post('/api/energy/transfer/suborg-org', {
                orgIdTo: orgId,
                suborgIdFrom: selectedSuborgId,
                countEnergy: countEnergyTranfser
            });

            setEnergy(result.data.orgEnergy);
            setCountEnergyTranfser(0);
        }
        catch (e) {
            alert('Не удалось выполнить перевод. Возможно у вас не хватает энергии');
        }
    }

    return (
        <div className="energy-transfer-to-from-suborgs">
            <div className="energy-transfer-to-from-suborgs__title">
                <h2>
                    Переводы энергии между подорганизациями
                </h2>
            </div>
            <div className="energy-transfer-to-from-suborgs__content">
                <div className="energy-transfer-to-from-suborgs__content-row">
                    <p className="energy-transfer-to-from-suborgs__content-row__title">
                        Текущая энергия организации:
                    </p>
                    <input 
                        className="energy-transfer-to-from-suborgs__content-row__input"
                        type="number" 
                        value={energy}
                        readOnly={true}
                    />
                </div>
                <div className="energy-transfer-to-from-suborgs__content-row">
                    <p className="energy-transfer-to-from-suborgs__content-row__title">
                        Подорганизация:
                    </p>
                    <select
                        className="energy-transfer-to-from-suborgs__content-row__select"
                        value={selectedSuborgId}
                        onChange={handleChangeSuborgsSelect}
                    >
                        {suborgs?.map(suborg => (
                            <option value={suborg.id} key={suborg.id}>
                                {suborg.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="energy-transfer-to-from-suborgs__content-row">
                    <p className="energy-transfer-to-from-suborgs__content-row__title">
                        Количество для перевода:
                    </p>
                    <input 
                        className="energy-transfer-to-from-suborgs__content-row__input"
                        type="number" 
                        value={countEnergyTranfser}
                        onChange={handleChangeCountEnergyToTransfer}
                    />
                </div>
                <div className="energy-transfer-to-from-suborgs__content-btns">
                    <button
                        onClick={fetchTransferFromOrgToSuborg}
                    >
                        Перевод в подорганизацию
                    </button>
                    <button
                        onClick={fetchTransferFromSuborgToOrg}
                    >
                        Перевод из подорганизации
                    </button>
                </div>
            </div>
        </div>
    );
}