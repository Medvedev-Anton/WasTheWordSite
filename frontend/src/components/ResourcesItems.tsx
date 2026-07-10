import { useEffect, useState } from 'react';
import { Resource, SimpleItem } from '../types';
import './ResourcesItems.css';

interface ResourcesItemsProps {
    resources?: Resource[];
    simpleItems?: SimpleItem[];
}

export default function ResourcesItems(
    {
        resources,
        simpleItems
    }: ResourcesItemsProps
) {
    const [emptyCeils, setEmptyCeils] = useState<number[]>([]);

    useEffect(() => {
        const emptyCeilsArr = [];

        let countNotEmptyCeils = 0;

        if (resources !== undefined) {
            countNotEmptyCeils += resources.length
        }

        if (simpleItems !== undefined) {
            countNotEmptyCeils += simpleItems.length
        }

        for (let i = 0; i < (12 - countNotEmptyCeils); i++) {
            emptyCeilsArr.push(i);
        }     

        setEmptyCeils(emptyCeilsArr);
    }, [resources]);

    return (
        <div className="resources-items-content">
            {resources?.map(resource => (
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
                </div>
            ))}

            {simpleItems?.map(item => (
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