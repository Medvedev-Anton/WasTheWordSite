import { useEffect, useState } from 'react';
import './OrgBuyEnergy.css';
import axios from 'axios';

interface OrgBuyEnergyProps {
    orgId: number;
    orgEnergy: number;
}

export default function OrgBuyEnergy(
    {
        orgId,
        orgEnergy,

    }: OrgBuyEnergyProps
) {
    const [energy, setEnergy] = useState<number>(0);
    const [energyPrice, setEnergyPrice] = useState<number>(0);
    const [countBuyEnergy, setCountBuyEnergy] = useState<number>(0);

    useEffect(() => {
        fetchEnergyPrice();
    }, []);

    useEffect(() => {
        setEnergy(orgEnergy);
    }, [orgEnergy]);

    // Запрос на получение цены за единицу энергии
    const fetchEnergyPrice = async () => { 
        try {
            const result = await axios.get('/api/energy/params/buyEnergyPrice');
            setEnergyPrice(result.data.price);
        }
        catch (e) {
            alert('Не удалось получить цену за единицу энергии');
        }
    }

    // Изменение количества покупаемой энергии
    const handleChangeCountBuyEnergy = (e: any) => {
        setCountBuyEnergy(e.target.value);
    }

    // Запрос на покупку энергии
    const fetchBuyEnergy = async () => {
        try {
            const result = await axios.post('/api/energy/org-buy', {
                orgId: orgId,
                countEnergy: countBuyEnergy
            });

            setEnergy(result.data.orgEnergy);
            setCountBuyEnergy(0);
        }
        catch (e) {
            alert('Не удалось купить энергию. Возможно у вас не хватает средств');
        }
    }

    return (
        <div className="org-buy-energy">
            <div className="org-buy-energy__title">
                <h2>
                    Покупка энергии
                </h2>
            </div>
            <div className="org-buy-energy__content">
                <div className="org-buy-energy__content-row">
                    <p className="org-buy-energy__content-row__title">
                        Текущая энергия организации:
                    </p>
                    <input 
                        className="org-buy-energy__content-row__input"
                        type="number" 
                        value={energy}
                        readOnly={true}
                    />
                </div>
                <div className="org-buy-energy__content-row">
                    <p className="org-buy-energy__content-row__title">
                        Цена за единицу:
                    </p>
                    <input 
                        className=" org-buy-energy__content-row__input input-with-dollar-back"
                        type="number" 
                        value={energyPrice}
                        readOnly={true}
                    />
                </div>
                <div className="org-buy-energy__content-row">
                    <p className="org-buy-energy__content-row__title">
                        Сколько купить:
                    </p>
                    <input 
                        className=" org-buy-energy__content-row__input"
                        type="number" 
                        value={countBuyEnergy}
                        onChange={handleChangeCountBuyEnergy}
                    />
                </div>
                <button
                    className="org-buy-energy__content__but-btn"
                    onClick={fetchBuyEnergy}
                >
                    Купить
                </button>
            </div>
        </div>
    );
}