import { useEffect, useState } from 'react';
import { Resource, SimpleItem } from '../types';
import './ResourcesItems.css';
import axios from 'axios';

interface ResourcesItemsProps {
    resources?: Resource[];
    simpleItems?: SimpleItem[];
    type: 'org' | 'user',
    isAdmin?: boolean,
    ownerId: number;
    userId: number;
    orgParentId?: number | null;
    onUserBuyResource?: (newBalance: number) => void;
}

export default function ResourcesItems(
    {
        resources,
        simpleItems,
        type,
        isAdmin,
        ownerId,
        userId,
        orgParentId,
        onUserBuyResource
    }: ResourcesItemsProps
) {
    const [emptyCeils, setEmptyCeils] = useState<number[]>([]);
    const [mutableResources, setMutableResources] = useState<Resource[]>([]);
    const [mutableSimpleItems, setMutableSimpleItems] = useState<SimpleItem[]>([]);

    useEffect(() => {
        const emptyCeilsArr = [];

        let countNotEmptyCeils = 0;

        if (resources !== undefined) {
            countNotEmptyCeils += resources.length;
            setMutableResources(resources);
        }

        if (simpleItems !== undefined) {
            countNotEmptyCeils += simpleItems.length;
            setMutableSimpleItems(simpleItems);
        }

        for (let i = 0; i < (10 - countNotEmptyCeils); i++) {
            emptyCeilsArr.push(i);
        }

        setEmptyCeils(emptyCeilsArr);
    }, [resources]);

    useEffect(() => {
        const emptyCeilsArr = [];

        let countNotEmptyCeils = 0;

        if (mutableResources !== undefined) {
            countNotEmptyCeils += mutableResources.length;
        }

        if (mutableSimpleItems !== undefined) {
            countNotEmptyCeils += mutableSimpleItems.length;
        }

        for (let i = 0; i < (10 - countNotEmptyCeils); i++) {
            emptyCeilsArr.push(i);
        }

        setEmptyCeils(emptyCeilsArr);
    }, [mutableResources, mutableSimpleItems]);

    useEffect(() => {
        if (simpleItems !== undefined) {
            setMutableSimpleItems(simpleItems);
        }
    }, [simpleItems]);

    // Обработка изменения цены ресурса
    const handleChangeResourcePrice = (resourceId: number, newValue: number) => {
        setMutableResources(prev => prev.map(resource => {
            if (resource.id === resourceId) {
                return {
                    ...resource,
                    price: newValue * 100
                }
            }

            return resource;
        }));
    }

    // Отправка запроса на изменение цены ресурса
    const fetchUpdateResourcePrice = (resourceId: number, newPrice: number) => {
        let route = '';

        if (type === 'org') {
            route = `/api/organizations/${ownerId}/resources/${resourceId}/price`;
        }
        
        try {
            axios.patch(route, {
                newPrice: newPrice * 100
            });
        }
        catch (e) {
            alert('Не удалось обновить цену');
        }
    }

    // Отправка запроса на покупку ресурса пользователем у организации
    const fetchBuyUserFromOrgResource = async (resourceId: number) => {
        try {
            const result = await axios.post(`/api/resources/${resourceId}/buy-user-from-org`, {
                sellerId: ownerId,
                buyerId: userId
            });
            
            const sellerBalance = result.data.sellerBalance;
            const sellerResources = result.data.sellerResources;

            setMutableResources(sellerResources);
            onUserBuyResource?.(sellerBalance);
        }
        catch (e) {
            alert('Не удалось приобрести ресурс. Возможно у вас не хватает средств');
        }
    }

    // Обработка изменения цены простого предмета
    const handleChangeSimpleItemPrice = (simpleItemId: number, newValue: number) => {
        setMutableSimpleItems(prev => prev.map(item => {
            if (item.id === simpleItemId) {
                return {
                    ...item,
                    price: newValue * 100
                }
            }

            return item;
        }));
    }

    // Отправка запроса на изменение цены ресурса
    const fetchUpdateSimpleItemPrice = (simpleItemId: number, newPrice: number) => {
        let route = '';

        if (type === 'org') {
            route = `/api/organizations/${ownerId}/simple-items/${simpleItemId}/price`;
        }
        
        try {
            axios.patch(route, {
                newPrice: newPrice * 100
            });
        }
        catch (e) {
            alert('Не удалось обновить цену');
        }
    }

    // Отправка запроса на покупку ресурса пользователем у организации
    const fetchBuyUserFromOrgSimpleItem = async (simpleItemId: number) => {
        try {
            const result = await axios.post(`/api/simple-items/${simpleItemId}/buy-user-from-org`, {
                sellerId: ownerId,
                buyerId: userId
            });
            
            const sellerBalance = result.data.sellerBalance;
            const sellerSimpleItems = result.data.sellerSimpleItems;

            setMutableSimpleItems(sellerSimpleItems);
            onUserBuyResource?.(sellerBalance);
        }
        catch (e) {
            alert('Не удалось приобрести предмет. Возможно у вас не хватает средств');
        }
    }

    return (
        <div className="resources-items-content">
            {mutableResources?.map(resource => (
                <div key={resource.id} className="resources-items__ceil">
                    <div className="resources-items__ceil-image-wrapper">
                        <img src={resource.imageUrl} alt="resource image" />
                    </div>
                    <div className="resources-items__ceil-title">
                        {resource.name}
                    </div>
                    <div className="resources-items__ceil-count">
                        {resource.count || 0} шт.
                    </div>
                    {isAdmin && orgParentId === null && (
                        <input 
                            type="number" 
                            className="resources-items__ceil-price-input dollar-bg"
                            value={resource.price !== undefined ? (resource.price / 100).toFixed(2) : 0}
                            onChange={(e) => handleChangeResourcePrice(resource.id, parseFloat(e.target.value))}
                            onBlur={(e) => fetchUpdateResourcePrice(resource.id, parseFloat(e.target.value))}
                            step="any"
                        />
                    )}
                    {!isAdmin && type === 'org' && (
                        <>
                            <span className="resources-items__ceil-price-span">
                                {resource.price !== undefined ? (resource.price / 100).toFixed(2) : 0} BFB / 1 ед.
                            </span>

                            <button
                                onClick={() => fetchBuyUserFromOrgResource(resource.id)}
                                className="resources-items__ceil-buy-user-btn"
                            >
                                Купить
                            </button>
                        </>
                    )}
                </div>
            ))}

            {mutableSimpleItems?.map(item => (
                <div key={item.id} className="resources-items__ceil">
                    <div className="resources-items__ceil-image-wrapper">
                        <img src={item.imageUrl} alt="resource image" />
                    </div>
                    <div className="resources-items__ceil-title">
                        {item.name}
                    </div>
                    <div className="resources-items__ceil-count">
                        {item.count || 0} шт.
                    </div>
                    {isAdmin && orgParentId === null && (
                        <input 
                            type="number" 
                            className="resources-items__ceil-price-input dollar-bg"
                            value={item.price !== undefined ? (item.price / 100).toFixed(2) : 0}
                            onChange={(e) => handleChangeSimpleItemPrice(item.id, parseFloat(e.target.value))}
                            onBlur={(e) => fetchUpdateSimpleItemPrice(item.id, parseFloat(e.target.value))}
                            step="any"
                        />
                    )}
                    {!isAdmin && type === 'org' && (
                        <>
                            <span className="resources-items__ceil-price-span">
                                {item.price !== undefined ? (item.price / 100).toFixed(2) : 0} BFB / 1 ед.
                            </span>

                            <button
                                onClick={() => fetchBuyUserFromOrgSimpleItem(item.id)}
                                className="resources-items__ceil-buy-user-btn"
                            >
                                Купить
                            </button>
                        </>
                    )}
                </div>
            ))}

            {
                emptyCeils.map(elem => (
                    <div key={elem} className="resources-items__ceil">

                    </div>
                ))
            }
        </div>
    );
}