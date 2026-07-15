import { useEffect, useState } from 'react';
import './SimpleItemBuyOrgFromOrg.css';
import { Organization, SimpleItem } from '../types';
import axios from 'axios';

interface SimpleItemBuyOrgFromOrgProps {
    orgId: number;
    onBuy: (newBalance: number) => void;
}

export default function SimpleItemBuyOrgFromOrg(
    { orgId, onBuy }: SimpleItemBuyOrgFromOrgProps
) {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrgId, setSelectedOrgId] = useState<number | undefined>(undefined);
    const [selectedAllOrgSimpleItems, setSelectedAllOrgSimpleItems] = useState<SimpleItem[]>([]);
    const [selectedOrgSimpleItem, setSelectedOrgSimpleItem] = useState<SimpleItem | undefined>(undefined);
    const [selectedSimpleItemPrice, setSelectedSimpleItemPrice] = useState<number>(0);

    useEffect(() => {
        fetchAllOrgs();
    }, []);

    useEffect(() => {
        if (selectedOrgId !== undefined) {
            fetchAllOrgSimpleItems(selectedOrgId);
        }        
    }, [selectedOrgId]);

    useEffect(() => {
        if (selectedAllOrgSimpleItems !== undefined) {
            setSelectedOrgSimpleItem(selectedAllOrgSimpleItems[0]);
        }        
    }, [selectedAllOrgSimpleItems]);

    useEffect(() => {
        if (selectedOrgSimpleItem !== undefined) {
            setSelectedSimpleItemPrice(selectedOrgSimpleItem.price || 0);
        }
        else {
            setSelectedSimpleItemPrice(0);
        }
    }, [selectedOrgSimpleItem]);

    // Запрос на получение всех организаций
    const fetchAllOrgs = async () => {
        try {
            const result = await axios.get('/api/organizations');
            const orgs = result.data;

            const filteredOrgs = orgs.filter(o => o.id !== orgId);

            setOrganizations(filteredOrgs);
            setSelectedOrgId(filteredOrgs[0].id);
        }
        catch (e) {
            throw new Error('Не удалось получить список организаций');
        }
    }

    // Обработка изменения выбранной организации
    const handleChangeOrgsSelect = (e: any) => {
        setSelectedOrgId(e.target.value);
    }

    // Запрос на получение всех простых предметов организации
    const fetchAllOrgSimpleItems = async (orgId: number) => {
        try {
            const result = await axios.get(`/api/organizations/${orgId}/simple-items`);
            const simpleItems = result.data.simpleItems;

            setSelectedAllOrgSimpleItems(simpleItems);
        }
        catch (e) {
            alert('Не удалось получить простые предметы организации');
        }
    }

    // Обработка изменения выбранного простого предмета
    const handleChangeSimpleItemSelect = (e: any) => {
        const simpleItem = selectedAllOrgSimpleItems.find(r => r.id == e.target.value);
        setSelectedOrgSimpleItem(simpleItem);
    }

    // Обработка отправки запроса на покупку
    const fetchBuy = async () => {
        try {
            const result = await axios.post(`/api/simple-items/${selectedOrgSimpleItem?.id}/buy-org-from-org`, {
                sellerId: selectedOrgId,
                buyerId: orgId
            });

            const buyerBalance = result.data.buyerBalance;
            const sellerSimpleItems = result.data.sellerSimpleItems;

            onBuy(buyerBalance);
            setSelectedAllOrgSimpleItems(sellerSimpleItems);
        }
        catch (e) {
            alert('Не удалось совершить покупку. Возможно у вас не хватает средств');
        }
    }

    return (
        <div className="simple-item-buy-org-from-org">
            <div className="simple-item-buy-org-from-org__title-wrapper">
                <h2>
                    Покупка простого предмета у организации
                </h2>
            </div>
            <div className="simple-item-buy-org-from-org__content">
                <div className="simple-item-buy-org-from-org__row">
                    <div className="simple-item-buy-org-from-org__row-title">
                        Организация:
                    </div>
                    <div className="simple-item-buy-org-from-org__row-value">
                        <select
                            value={selectedOrgId}
                            onChange={handleChangeOrgsSelect}
                        >
                            {organizations?.map(org => (
                                <option key={org.id} value={org.id}>
                                    {org.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="simple-item-buy-org-from-org__row">
                    <div className="simple-item-buy-org-from-org__row-title">
                        Простые предметы организации:
                    </div>
                    <div className="simple-item-buy-org-from-org__row-value">
                        <select
                            value={selectedOrgSimpleItem?.id}
                            onChange={handleChangeSimpleItemSelect}
                        >
                            {selectedAllOrgSimpleItems?.map(simpleItem => (
                                <option key={simpleItem.id} value={simpleItem.id}>
                                    {simpleItem.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="simple-item-buy-org-from-org__row">
                    <div className="simple-item-buy-org-from-org__row-title">
                        Цена:
                    </div>
                    <div className="simple-item-buy-org-from-org__row-value">
                        <p>
                            {(selectedSimpleItemPrice / 100).toFixed(2)} $
                        </p>
                    </div>
                </div>
                <button
                    className="simple-item-buy-org-from-org__buy-btn"
                    onClick={fetchBuy}
                >
                    Купить
                </button>
            </div>
        </div>
    );
}