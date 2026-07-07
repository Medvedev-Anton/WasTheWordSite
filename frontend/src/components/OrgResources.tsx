import { Resource } from '../types';
import './OrgResources.css';

interface OrgResourcesProps {
    resources: Resource[];
}

export default function OrgResources(
    {
        resources
    }: OrgResourcesProps
) {
    return (
        <div className="org-resources-content">
            {resources?.map(resource => (
                <div className="org-resources__ceil">
                    <div className="org-resources__ceil-image-wrapper">
                        <img src={resource.imageUrl} alt="resource image" />
                    </div>
                    <div className="org-resources__ceil-title">
                        {resource.name}
                    </div>
                </div>
            ))}
        </div>
    );
}