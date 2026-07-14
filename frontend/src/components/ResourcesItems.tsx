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
}

export default function ResourcesItems(
    {
        resources,
        simpleItems,
        type,
        isAdmin,
        ownerId
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
        }

        for (let i = 0; i < (10 - countNotEmptyCeils); i++) {
            emptyCeilsArr.push(i);
        }

        setEmptyCeils(emptyCeilsArr);
    }, [resources]);

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
                    price: newValue
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
                newPrice: newPrice
            });
        }
        catch (e) {
            alert('Не удалось обновить цену');
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
                    {isAdmin && (
                        <input 
                            type="number" 
                            className="resources-items__ceil-price-input dollar-bg"
                            value={resource.price}
                            onChange={(e) => handleChangeResourcePrice(resource.id, parseInt(e.target.value))}
                            onBlur={(e) => fetchUpdateResourcePrice(resource.id, parseInt(e.target.value))}
                        />
                    )}
                    {!isAdmin && (
                        <span className="resources-items__ceil-price-span">
                            {resource.price} $ / ед.
                        </span>
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