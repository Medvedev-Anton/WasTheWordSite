import { useEffect, useState } from 'react';
import './ResourceBuyOrgFromOrg.css';
import { Organization, Resource } from '../types';
import axios from 'axios';

interface ResourceBuyOrgFromOrgProps {
    orgId: number;
    onBuy: (newBalance: number) => void;
}

export default function ResourceBuyOrgFromOrg(
    { orgId, onBuy }: ResourceBuyOrgFromOrgProps
) {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrgId, setSelectedOrgId] = useState<number | undefined>(undefined);
    const [selectedAllOrgResources, setSelectedAllOrgResources] = useState<Resource[]>([]);
    const [selectedOrgResource, setSelectedOrgResource] = useState<Resource | undefined>(undefined);
    const [selectedResourcePrice, setSelectedResourcePrice] = useState<number>(0);

    useEffect(() => {
        fetchAllOrgs();
    }, []);

    useEffect(() => {
        if (selectedOrgId !== undefined) {
            fetchAllOrgResources(selectedOrgId);
        }        
    }, [selectedOrgId]);

    useEffect(() => {
        setSelectedOrgResource(selectedAllOrgResources[0]);
    }, [selectedAllOrgResources]);

    useEffect(() => {
        if (selectedOrgResource !== undefined) {
            setSelectedResourcePrice(selectedOrgResource.price || 0);
        }
        else {
            setSelectedResourcePrice(0);
        }
    }, [selectedOrgResource]);

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

    // Запрос на получение всех ресурсов организации
    const fetchAllOrgResources = async (orgId: number) => {
        try {
            const result = await axios.get(`/api/organizations/${orgId}/resources`);
            const resources = result.data.resources;

            setSelectedAllOrgResources(resources);
        }
        catch (e) {
            alert('Не удалось получить ресурсы организации');
        }
    }

    // Обработка изменения выбранного ресурса
    const handleChangeResourceSelect = (e: any) => {
        const resource = selectedAllOrgResources.find(r => r.id == e.target.value);
        setSelectedOrgResource(resource);
    }

    // Обработка отправки запроса на покупку
    const fetchBuy = async () => {
        try {
            const result = await axios.post(`/api/resources/${selectedOrgResource?.id}/buy-org-from-org`, {
                sellerId: selectedOrgId,
                buyerId: orgId
            });

            const buyerBalance = result.data.buyerBalance;
            const sellerResources = result.data.sellerResources;

            onBuy(buyerBalance);
            setSelectedAllOrgResources(sellerResources);
        }
        catch (e) {
            alert('Не удалось совершить покупку. Возможно у вас не хватает средств');
        }
    }

    return (
        <div className="resource-buy-org-from-org">
            <div className="resource-buy-org-from-org__title-wrapper">
                <h2>
                    Покупка ресурса у организации
                </h2>
            </div>
            <div className="resource-buy-org-from-org__content">
                <div className="resource-buy-org-from-org__row">
                    <div className="resource-buy-org-from-org__row-title">
                        Организация:
                    </div>
                    <div className="resource-buy-org-from-org__row-value">
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
                <div className="resource-buy-org-from-org__row">
                    <div className="resource-buy-org-from-org__row-title">
                        Ресурсы организации:
                    </div>
                    <div className="resource-buy-org-from-org__row-value">
                        <select
                            value={selectedOrgResource?.id}
                            onChange={handleChangeResourceSelect}
                        >
                            {selectedAllOrgResources?.map(resource => (
                                <option key={resource.id} value={resource.id}>
                                    {resource.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="resource-buy-org-from-org__row">
                    <div className="resource-buy-org-from-org__row-title">
                        Цена:
                    </div>
                    <div className="resource-buy-org-from-org__row-value">
                        <p>
                            {(selectedResourcePrice / 100).toFixed(2)} $
                        </p>
                    </div>
                </div>
                <button
                    className="resource-buy-org-from-org__buy-btn"
                    onClick={fetchBuy}
                >
                    Купить
                </button>
            </div>
        </div>
    );
}