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
        </div>
    );
}