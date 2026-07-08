import { useEffect, useState } from 'react';
import { Resource } from '../types';
import './Resources.css';

interface ResourcesProps {
    resources: Resource[];
}

export default function Resources(
    {
        resources
    }: ResourcesProps
) {
    const [emptyCeils, setEmptyCeils] = useState<number[]>([]);

    useEffect(() => {
        const emptyCeilsArr = [];

        for (let i = 0; i < (12 - resources.length); i++) {
            emptyCeilsArr.push(i);
        }

        setEmptyCeils(emptyCeilsArr);
    }, [resources]);

    return (
        <div className="resources-content">
            {resources?.map(resource => (
                <div key={resource.id} className="resources__ceil">
                    <div className="resources__ceil-image-wrapper">
                        <img src={resource.imageUrl} alt="resource image" />
                    </div>
                    <div className="resources__ceil-title">
                        {resource.name}
                    </div>
                </div>
            ))}

            {
                emptyCeils.map(elem => (
                    <div key={elem} className="resources__ceil">

                    </div>
                ))
            }
        </div>
    );
}